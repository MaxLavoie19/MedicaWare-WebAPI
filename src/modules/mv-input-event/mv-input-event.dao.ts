import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class MvInputEventDao extends DataAccessObject {
  fetchVisitMvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_mv.amount, in_mv.amountuom, in_mv.ordercategoryname, in_mv.patientweight,
          in_mv.totalamount, in_mv.totalamountuom, in_mv.starttime, itm.label
        FROM inputevents_mv AS in_mv
        JOIN d_items AS itm ON itm.itemid = in_mv.itemid
        WHERE in_mv.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
