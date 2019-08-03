import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class NoteDao extends DataAccessObject {
  fetchVisitNotes(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT category, description, text
        FROM noteevents
        WHERE hadm_id = $(admissionId) AND iserror != '1'
      `, { admissionId }));
  }
}
