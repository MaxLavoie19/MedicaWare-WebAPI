import { from } from "rxjs";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { Json } from "../../types/json";

export class EventModule {
  constructor(
    private app: Application,
    private eventDict: EventDictionary
  ) { }

  init() {
    this.app.get('/event/:eventGuid', (req: Request, res: Response) => {
      const eventGuid = req.params.eventGuid;
      const eventObservable = from(this.eventDict.getEvent(eventGuid));
      let response: string;
      let timeout: NodeJS.Timeout;
      const subscription = eventObservable.subscribe((value: Json | Json[]) => {
        response = JSON.stringify(value);
        subscription.unsubscribe();
        clearTimeout(timeout);
        res.send(response);
      });
      timeout = setTimeout(() => {
        if (!response) {
          response = `The event ${eventGuid} did not resolve yet. Try again latter`;
          subscription.unsubscribe();
          res.send(response);
        }
      }, 100);
    });
  }
}
