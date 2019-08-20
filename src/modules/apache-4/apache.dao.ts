import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class ApacheDao extends DataAccessObject {
  fetchVisitApacheData(): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT
          adm.hadm_id,
          EXTRACT(YEAR FROM AGE(adm.admittime, pat.dob))::varchar(4) AS age,
          adm.dischtime - adm.admittime AS length_of_stay,
          adm.diagnosis,
          COALESCE(pat.dod < adm.admittime + interval '1 month', false) AS died_within_a_month
        FROM admissions AS adm
        JOIN patients AS pat ON pat.subject_id = adm.subject_id
        JOIN icustays AS stays ON adm.hadm_id = stays.hadm_id
        WHERE adm.admission_type != 'NEWBORN'
      `, {}));
  }
}
