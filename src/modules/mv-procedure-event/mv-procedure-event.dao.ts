import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class MvProcedureEventDao extends DataAccessObject {
  fetchVisitMvProcedureEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT ordercategoryname, value, valueuom
        FROM procedureevents_mv
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
