import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class PrescriptionDao extends DataAccessObject {
  fetchVisitPrescriptions(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT drug, dose_val_rx, dose_unit_rx, route
        FROM prescriptions
        WHERE hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
