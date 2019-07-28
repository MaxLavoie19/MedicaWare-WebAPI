import { from, BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { Json } from "../types/json";
import { NamedParamClient } from "../named-param-client/named-param-client";

export class DataAccessObject {
  constructor(protected client: NamedParamClient) { }

  async getRow(tableName: string, rowId: number): Promise<Json> {
    const queryResult = await this.client.namedParametersQuery(`
        SELECT *
        FROM ${tableName}
        WHERE row_id=$(rowId)
      `,
      { rowId }
    );
    return queryResult[0];
  }

  getTable(tableName: string): Promise<Json[]> {
    return this.client.namedParametersQuery(`
      SELECT *
      FROM ${tableName}
    `);
  }
  /*
  fetchNotes(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT category, description, text
        FROM noteevents
        WHERE hadm_id = $(admissionId) AND iserror != '1'
      `, { admissionId }));
  }

  fetchChartEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT chrt.charttime, chrt.valuenum, chrt.valueuom, itm.label
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchCvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_cv.charttime, in_cv.amount, in_cv.amountuom, itm.label
        FROM inputevents_cv AS in_cv
        JOIN d_items AS itm ON itm.itemid = in_cv.itemid
        WHERE in_cv.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchMvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_mv.amount, in_mv.amountuom, in_mv.ordercategoryname, in_mv.patientweight,
          in_mv.totalamount, in_mv.totalamountuom, in_mv.starttime, itm.label
        FROM inputevents_mv AS in_mv
        JOIN d_items AS itm ON itm.itemid = in_mv.itemid
        WHERE in_mv.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchDiagnosisRelatedGroup(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drg_code, description
        FROM drgcodes
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchMicrobiology(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT bio.spec_type_desc, bio.org_name, bio.org_name, itm.label
        FROM microbiologyevents AS bio
        JOIN d_items AS itm ON itm.itemid = bio.org_itemid
        WHERE bio.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchOutputs(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT DISTINCT itm.label, out.value, out.valueuom, out.charttime
        FROM outputevents AS out
        JOIN d_items AS itm ON out.itemid = itm.itemid
        WHERE out.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchPrescriptions(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drug, dose_val_rx, dose_unit_rx, route
        FROM prescriptions
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchLabEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT lab.valuenum, lab.valueuom, lab.flag, itm.label AS itm_label,
        lab_itm.label AS lab_itm_label
        FROM labevents AS lab
        JOIN d_items AS itm ON lab.itemid = itm.itemid
        JOIN d_labitems AS lab_itm ON lab_itm.itemid = lab.itemid
        WHERE lab.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchMvProcedureEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT ordercategoryname, value, valueuom
        FROM procedureevents_mv
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchProcedures(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT proc_icd.icd9_code, icd_proc.long_title
        FROM procedures_icd AS proc_icd
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = proc_icd.icd9_code
        WHERE proc_icd.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchDiagnoses(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT diagnose.icd9_code, icd_proc.long_title
        FROM diagnoses_icd as diagnose
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = diagnose.icd9_code
        WHERE diagnose.hadm_id = $(admissionId)
      `, { admissionId }));
  }

  fetchProceduralTerminology(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT costcenter, description, description like '%INVASIVE%' AS is_invasive
        FROM cptevents
        WHERE costcenter = 'Resp' AND hadm_id = $(admissionId)
      `, { admissionId }));
  }
  */
}
