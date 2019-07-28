
import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { Json } from "../types/json";

export class EventDictionary {
  private eventDict: { [guid: string]: Observable<Json | Json[]> } = {};
  constructor() { }

  addEvent(event: Observable<Json | Json[]>) {
    const guid = Guid.create().toString();
    this.eventDict[guid] = event;
    return guid;
  }

  getEvent(guid: string) {
    return this.eventDict[guid];
  }
}
