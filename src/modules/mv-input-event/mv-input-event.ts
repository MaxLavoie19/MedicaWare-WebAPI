import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { MvInputEventDao } from "./mv-input-event.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class MvInputEventModule extends DataModule {
  protected dataAccessObject: MvInputEventDao;

  constructor(
    app: Application,
    client: NamedParamClient,
    eventDict: EventDictionary,
    subModuleList?: DataModule[]
  ) {
    super(
      app,
      eventDict,
      subModuleList
    );
    this.dataAccessObject = new MvInputEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/mv-input-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const mvInputEventsQueryObservable = from(this.dataAccessObject.fetchVisitMvInputEvents(visitId));
      const guid = this.eventDict.addEvent(mvInputEventsQueryObservable);
      response.send({ guid });
    });
  }
}
