import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class CvInputEventDao extends DataAccessObject {
  fetchVisitCvInputEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT in_cv.charttime, in_cv.amount, in_cv.amountuom, itm.label
        FROM inputevents_cv AS in_cv
        JOIN d_items AS itm ON itm.itemid = in_cv.itemid
        WHERE in_cv.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
