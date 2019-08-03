import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class OutputDao extends DataAccessObject {
  fetchVisitOutputs(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT DISTINCT itm.label, out.value, out.valueuom, out.charttime
        FROM outputevents AS out
        JOIN d_items AS itm ON out.itemid = itm.itemid
        WHERE out.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
