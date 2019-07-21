import { Json } from "../types/json";
import { EventDictionary } from "../event-dictionary/event-dictionary";
import { Observable, BehaviorSubject } from "rxjs";
import { type } from "os";

export class EventTree {
  observable = new BehaviorSubject<Json>({});

  private eventDictionary: EventDictionary;
  private tree: {[name: string]: EventTree | string | Json| Json[]} = {};

  constructor(eventDictionary: EventDictionary) {
    this.eventDictionary = eventDictionary;
  }

  toJson(): Json {
    const tree: Json = {};
    Object.keys(this.tree).forEach((branchName: string) => {
      const branch = this.tree[branchName];
      let branchContent;
      if (branch && branch instanceof EventTree) {
        branchContent = branch.toJson();
      } else {
        branchContent = branch;
      }
      tree[branchName] = branchContent;
    });
    return tree;
  }

  setEvent(name: string, event: Observable<Json[]>) {
    const guid =  this.eventDictionary.addEvent(event);
    this.setValue(name, guid);
  }

  setSubtree(name: string, subtree: EventTree) {
    this.setValue(name, subtree);
  }

  setJson(name: string, json: Json | Json[]) {
    this.setValue(name, json);
  }

  private emit() {
    this.observable.next(this.toJson());
  }

  private setValue(name: string, value: EventTree | string | Json | Json[]) {
    this.tree[name] = value;
    this.emit();
  }
}
