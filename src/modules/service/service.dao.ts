import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class ServiceDao extends DataAccessObject {
  fetchVisitServices(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT prev_service, curr_service
        FROM services
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
