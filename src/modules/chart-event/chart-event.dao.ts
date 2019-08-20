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
  fetchVisitChartEventTypes(admissionId: number, dataType?: string): Observable<Json[]> {
    let dataTypeCondition = '';
    if (dataType === 'discrete') {
      dataTypeCondition = 'AND valuenum IS NULL';
    } else if (dataType === 'linear') {
      dataTypeCondition = 'AND valuenum IS NOT NULL';
    }
    return from(this.client.namedParametersQuery(`
        SELECT DISTINCT itm.label, chrt.itemid
        FROM chartevents AS chrt
        JOIN d_items AS itm ON itm.itemid = chrt.itemid
        WHERE chrt.hadm_id = $(admissionId) ${dataTypeCondition}
        ORDER BY itm.label
      `, { admissionId }));
  }
  fetchVisitChartEventsByType(admissionId: number, itemId: string): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT *
        FROM (
          SELECT DISTINCT ON
            (valuenum, valueuom, value, stopped, resultstatus) valuenum, valueuom, value, stopped, resultstatus,
            charttime
          FROM chartevents
          WHERE hadm_id = $(admissionId) AND itemid = $(itemId)
        ) distinct_chart
        ORDER BY charttime
      `, { admissionId, itemId }));
  }
  fetchVisitDiscreteChartEvents(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT *
        FROM (
          SELECT DISTINCT ON
            (value, stopped, resultstatus) value, stopped, resultstatus,
            charttime, itm.label
          FROM chartevents chrt
          JOIN d_items AS itm ON itm.itemid = chrt.itemid
          WHERE hadm_id = $(admissionId) AND valuenum IS NULL
        ) distinct_chart
        ORDER BY label
      `, { admissionId }));
  }
  fetchVisitLinearChartEventsMinMax(admissionId: number): Observable<Json[]> {
    return from(this.client.namedParametersQuery(`
        SELECT label, charttime, valuenum, valueuom, stopped, resultstatus
        FROM (
		      SELECT DISTINCT ON (valuenum) valuenum,
        	  itm.label, charttime, valueuom, stopped, resultstatus
          FROM chartevents chrt
          JOIN d_items AS itm ON itm.itemid = chrt.itemid
          WHERE chrt.hadm_id = $(admissionId)
            AND (
              valuenum = (
                SELECT MIN(valuenum)
                FROM chartevents
                WHERE hadm_id = chrt.hadm_id AND itemid = chrt.itemid AND valuenum IS NOT NULL
              )
              OR  valuenum = (
                SELECT MAX(valuenum)
                FROM chartevents
                WHERE hadm_id = chrt.hadm_id AND itemid = chrt.itemid AND valuenum IS NOT NULL
              )
            )
            ORDER BY valuenum, charttime
          ) limits
        ORDER BY label, charttime
      `, { admissionId }));
  }
}
