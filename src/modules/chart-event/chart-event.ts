import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ChartEventDao } from "./chart-event.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ChartEventModule extends DataModule {
  protected dataAccessObject: ChartEventDao;

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
    this.dataAccessObject = new ChartEventDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/chart-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const notesQueryObservable = from(this.dataAccessObject.fetchVisitChartEvents(visitId));
      const guid = this.eventDict.addEvent(notesQueryObservable);
      response.send({ guid });
    });
  }
}
