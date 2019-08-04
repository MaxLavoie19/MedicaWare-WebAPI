import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs";

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { Json } from "../../types/json";

export class ChartEventDao extends DataAccessObject {
  fetchVisitChartEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT chrt.charttime, chrt.valuenum, chrt.valueuom, itm.label
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId)
      `, { admissionId }));
  }
  fetchVisitChartEventTypes(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT DISTINCT itm.label
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId)
      `, { admissionId }));
  }
  fetchVisitChartEventsByType(admissionId: number, type: string): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT chrt.charttime, chrt.valuenum, chrt.valueuom
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId) AND itm.label = $(type)
      `, { admissionId, type }));
  }
}
