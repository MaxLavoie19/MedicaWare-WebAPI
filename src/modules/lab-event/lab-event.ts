import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { LabEventDao } from "./lab-event.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class LabEventModule extends DataModule {
  protected dataAccessObject: LabEventDao;

  constructor(
    app: Application,
    client: NamedParamClientPool,
    eventDict: EventDictionary,
    subModuleList?: DataModule[]
  ) {
    super(
      app,
      eventDict,
      subModuleList
    );
    this.dataAccessObject = new LabEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/lab-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const labEventsQueryObservable = from(this.dataAccessObject.fetchVisitLabEvents(visitId));
      const guid = this.eventDict.addEvent(labEventsQueryObservable);
      response.send({ guid });
    });
  }
}
