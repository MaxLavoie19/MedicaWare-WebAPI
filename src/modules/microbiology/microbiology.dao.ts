import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class MicrobiologyDao extends DataAccessObject {
  fetchVisitMicrobiologys(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT bio.spec_type_desc, bio.org_name, bio.org_name, itm.label
        FROM microbiologyevents AS bio
        JOIN d_items AS itm ON itm.itemid = bio.org_itemid
        WHERE bio.hadm_id = $(admissionId)
      `, { admissionId }));
  }
}
