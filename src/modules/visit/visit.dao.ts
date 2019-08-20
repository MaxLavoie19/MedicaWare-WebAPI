import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class VisitDao extends DataAccessObject {
  fetchVisit(visitId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
      SELECT adm.hadm_id, adm.admission_type, adm.marital_status, adm.ethnicity,
        adm.diagnosis, EXTRACT(DAY FROM(adm.dischtime - adm.admittime))::varchar AS length_of_stay, pat.gender,
        pat.dob, EXTRACT(YEAR FROM AGE(adm.admittime, pat.dob))::varchar AS age, pat.dod,
        COALESCE(pat.dod < adm.admittime + interval '1 month', false) AS died_within_a_month,
        stays.last_careunit
      FROM admissions AS adm
      JOIN patients AS pat ON pat.subject_id = adm.subject_id
      JOIN icustays AS stays ON adm.hadm_id = stays.hadm_id
      WHERE adm.row_id = $(visitId)
    `, { visitId }));
  }
}
