import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class ProcedureDao extends DataAccessObject {
  fetchVisitProcedures(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT proc_icd.icd9_code, icd_proc.long_title
        FROM procedures_icd AS proc_icd
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = proc_icd.icd9_code
        WHERE proc_icd.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
