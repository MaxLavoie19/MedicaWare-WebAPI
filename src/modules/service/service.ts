import { from } from "rxjs";

import { ServerModule } from "../../server-module/server-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ServiceDao } from "./service.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ServiceModule extends ServerModule {
  protected dataAccessObject: ServiceDao;

  constructor(
    app: Application,
    client: NamedParamClient,
    eventDict: EventDictionary,
    subModuleList?: ServerModule[]
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
      const visitsQueryObservable = from(this.dataAccessObject.fetchVisitServices(visitId));
      const guid = this.eventDict.addEvent(visitsQueryObservable);
      response.send({ guid });
    });
  }
}
