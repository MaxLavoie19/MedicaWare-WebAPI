import { from, BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { Json } from "../types/json";
import { NamedParamClient } from "../named-param-client/named-param-client";
import { EventDictionary } from '../event-dictionary/event-dictionary';
import { EventTree } from '../event-tree/event-tree';

export class DataAccessObject {
  private client: NamedParamClient;
  constructor(client: NamedParamClient) {
    this.client = client;
  }

  async getRow(tableName: string, rowId: number): Promise<Json> {
    const queryResult = await this.client.namedParametersQuery(`
        SELECT *
        FROM ${tableName}
        WHERE row_id=$(rowId)
      `,
      {rowId}
    );
    return queryResult[0];
  }

  getTable(tableName: string): Promise<Json[]> {
    return this.client.namedParametersQuery(`
      SELECT *
      FROM ${tableName}
    `);
  }

  getVisit(visitId: number, eventDict: EventDictionary): Json {
    const eventTree = new EventTree(eventDict);
    const visitQueryObservable = from(this.fetchVisit(visitId));
    eventTree.setEvent('visit', visitQueryObservable);
    visitQueryObservable.subscribe(async (visitQueryResult) => {
      const visit = visitQueryResult[0];
      const admissionId = Number(visit.hadm_id);

      const observableObj: {[name: string]: Observable<Json[]>} = {
        proceduralTerminology: this.fetchProceduralTerminology(admissionId),
        diagnoses: this.fetchDiagnoses(admissionId),
        procedures: this.fetchProcedures(admissionId),
        mvProcedureEvents: this.fetchMvProcedureEvents(admissionId),
        labEvents: this.fetchLabEvents(admissionId),
        prescriptions: this.fetchPrescriptions(admissionId),
        outputs: this.fetchOutputs(admissionId),
        microbiology: this.fetchMicrobiology(admissionId),
        diagnosisRelatedGroup: this.fetchDiagnosisRelatedGroup(admissionId),
        mvInputEvents: this.fetchMvInputEvents(admissionId),
        cvInputEvents: this.fetchCvInputEvents(admissionId),
        chartEvents: this.fetchChartEvents(admissionId),
        notes: this.fetchNotes(admissionId),
        services: this.fetchServices(admissionId),
      };
      Object.keys(observableObj).forEach((key) => {
        const observable = observableObj[key];
        eventTree.setEvent(key, observable);
      });
      eventTree.setSubtree('visit', eventTree);
    });
    return eventTree.toJson();
  }

  private fetchVisit(visitId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
      SELECT adm.row_id, adm.hadm_id, adm.admission_type, adm.marital_status, adm.ethnicity,
        adm.diagnosis, adm.dischtime - adm.admittime AS length_of_stay, pat.gender, pat.dob,
        pat.dod,
        COALESCE(pat.dod < adm.admittime + interval '1 month', false) AS died_within_a_month,
        stays.last_careunit
      FROM admissions AS adm
      JOIN patients AS pat ON pat.subject_id = adm.subject_id
      JOIN icustays AS stays ON adm.hadm_id = stays.hadm_id
      WHERE adm.row_id = $(visitId)
    `, { visitId }));
  }

  private fetchServices(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT prev_service, curr_service
        FROM services
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchNotes(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT category, description, text
        FROM noteevents
        WHERE hadm_id = $(admissionId) AND iserror != '1'
      `, { admissionId }));
  }

  private fetchChartEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT chrt.charttime, chrt.valuenum, chrt.valueuom, itm.label
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchCvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_cv.charttime, in_cv.amount, in_cv.amountuom, itm.label
        FROM inputevents_cv AS in_cv
        JOIN d_items AS itm ON itm.itemid = in_cv.itemid
        WHERE in_cv.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchMvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_mv.amount, in_mv.amountuom, in_mv.ordercategoryname, in_mv.patientweight,
          in_mv.totalamount, in_mv.totalamountuom, in_mv.starttime, itm.label
        FROM inputevents_mv AS in_mv
        JOIN d_items AS itm ON itm.itemid = in_mv.itemid
        WHERE in_mv.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchDiagnosisRelatedGroup(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drg_code, description
        FROM drgcodes
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchMicrobiology(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT bio.spec_type_desc, bio.org_name, bio.org_name, itm.label
        FROM microbiologyevents AS bio
        JOIN d_items AS itm ON itm.itemid = bio.org_itemid
        WHERE bio.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchOutputs(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT DISTINCT itm.label, out.value, out.valueuom, out.charttime
        FROM outputevents AS out
        JOIN d_items AS itm ON out.itemid = itm.itemid
        WHERE out.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchPrescriptions(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drug, dose_val_rx, dose_unit_rx, route
        FROM prescriptions
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchLabEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT lab.valuenum, lab.valueuom, lab.flag, itm.label AS itm_label,
        lab_itm.label AS lab_itm_label
        FROM labevents AS lab
        JOIN d_items AS itm ON lab.itemid = itm.itemid
        JOIN d_labitems AS lab_itm ON lab_itm.itemid = lab.itemid
        WHERE lab.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchMvProcedureEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT ordercategoryname, value, valueuom
        FROM procedureevents_mv
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchProcedures(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT proc_icd.icd9_code, icd_proc.long_title
        FROM procedures_icd AS proc_icd
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = proc_icd.icd9_code
        WHERE proc_icd.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchDiagnoses(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT diagnose.icd9_code, icd_proc.long_title
        FROM diagnoses_icd as diagnose
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = diagnose.icd9_code
        WHERE diagnose.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  private fetchProceduralTerminology(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT costcenter, description, description like '%INVASIVE%' AS is_invasive
        FROM cptevents
        WHERE costcenter = 'Resp' AND hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
