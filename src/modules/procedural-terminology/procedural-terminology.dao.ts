import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class ProceduralTerminologyDao extends DataAccessObject {
  fetchVisitProceduralTerminologys(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT costcenter, description, description like '%INVASIVE%' AS is_invasive
        FROM cptevents
        WHERE costcenter = 'Resp' AND hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
