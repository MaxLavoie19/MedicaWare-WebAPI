import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class DiagnosticDao extends DataAccessObject {
  fetchVisitDiagnostics(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT diagnose.icd9_code, icd_proc.long_title
        FROM diagnoses_icd as diagnose
        JOIN d_icd_procedures icd_proc ON icd_proc.icd9_code = diagnose.icd9_code
        WHERE diagnose.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
