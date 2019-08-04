import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ServiceDao } from "./service.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ServiceModule extends DataModule {
  protected dataAccessObject: ServiceDao;

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
    this.dataAccessObject = new ServiceDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/services', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const visitServicesQueryObservable = from(this.dataAccessObject.fetchVisitServices(visitId));
      const guid = this.eventDict.addEvent(visitServicesQueryObservable);
      response.send({ guid });
    });
  }
}
