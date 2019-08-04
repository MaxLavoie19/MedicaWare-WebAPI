import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ChartEventDao } from "./chart-event.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ChartEventModule extends DataModule {
  protected dataAccessObject: ChartEventDao;

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
    this.dataAccessObject = new ChartEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/chart-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const chartEventsQueryObservable = from(this.dataAccessObject.fetchVisitChartEvents(visitId));
      const guid = this.eventDict.addEvent(chartEventsQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/chart-event-types', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const chartEventTypesQueryObservable = from(this.dataAccessObject.fetchVisitChartEventTypes(visitId));
      const guid = this.eventDict.addEvent(chartEventTypesQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/chart-events/type/:type', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const type = request.params.type;
      const chartEventQueryObservable = from(this.dataAccessObject.fetchVisitChartEventsByType(visitId, type));
      const guid = this.eventDict.addEvent(chartEventQueryObservable);
      response.send({ guid });
    });
  }
}
