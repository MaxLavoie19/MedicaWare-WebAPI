import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { CvInputEventDao } from "./cv-input-event.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class CvInputEventModule extends DataModule {
  protected dataAccessObject: CvInputEventDao;

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
    this.dataAccessObject = new CvInputEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/cv-input-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const cvInputEventsQueryObservable = from(this.dataAccessObject.fetchVisitCvInputEvents(visitId));
      const guid = this.eventDict.addEvent(cvInputEventsQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/cv-input-event-groups', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const cvInputEventGroupsQueryObservable = from(this.dataAccessObject.fetchVisitCvInputEventGroups(visitId));
      const guid = this.eventDict.addEvent(cvInputEventGroupsQueryObservable);
      response.send({ guid });
    });
  }
}
