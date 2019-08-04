import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { MicrobiologyDao } from "./microbiology.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class MicrobiologyModule extends DataModule {
  protected dataAccessObject: MicrobiologyDao;

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
    this.dataAccessObject = new MicrobiologyDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/microbiology-events', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const microbiologysQueryObservable = from(this.dataAccessObject.fetchVisitMicrobiologys(visitId));
      const guid = this.eventDict.addEvent(microbiologysQueryObservable);
      response.send({ guid });
    });
  }
}
