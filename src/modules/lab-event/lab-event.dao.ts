import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class LabEventDao extends DataAccessObject {
  fetchVisitLabEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT lab.valuenum, lab.valueuom, lab.flag, itm.label AS itm_label,
        lab_itm.label AS lab_itm_label
        FROM labevents AS lab
        JOIN d_items AS itm ON lab.itemid = itm.itemid
        JOIN d_labitems AS lab_itm ON lab_itm.itemid = lab.itemid
        WHERE lab.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
