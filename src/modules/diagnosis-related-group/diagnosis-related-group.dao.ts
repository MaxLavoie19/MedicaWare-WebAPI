import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class DiagnosisRelatedGroupDao extends DataAccessObject {
  fetchVisitDiagnosisRelatedGroups(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drg_code, description
        FROM drgcodes
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
