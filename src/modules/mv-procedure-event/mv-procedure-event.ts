import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { MvProcedureEventDao } from "./mv-procedure-event.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class MvProcedureEventModule extends DataModule {
  protected dataAccessObject: MvProcedureEventDao;

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
    this.dataAccessObject = new MvProcedureEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/mv-procedure-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const mvProcedureEventsQueryObservable = from(this.dataAccessObject.fetchVisitMvProcedureEvents(visitId));
      const guid = this.eventDict.addEvent(mvProcedureEventsQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/mv-procedure-event-groups', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const mvProcedureEventGroupsQueryObservable = from(this.dataAccessObject.fetchVisitMvProcedureEventGroups(visitId));
      const guid = this.eventDict.addEvent(mvProcedureEventGroupsQueryObservable);
      response.send({ guid });
    });
  }
}
