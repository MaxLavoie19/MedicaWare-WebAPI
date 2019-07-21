import { Json } from "../types/json";
import { DataAccessObject } from "../data-access-object/data-access-object";
import { Observable, from } from "rxjs";

export class PostgresToJsonService {
  private dataAccessObject: DataAccessObject;
  constructor(dataAccessObject: DataAccessObject) {
    this.dataAccessObject = dataAccessObject;
  }

  getDataset(): Observable<Json[]> {
    return from([]);
  }

  getVisit(visitId: number): Observable<Json> {
    return this.dataAccessObject.getVisit(visitId);
  }

  getVisits(): Promise<Json[]> {
    return this.dataAccessObject.getTable('admissions');
  }
}
