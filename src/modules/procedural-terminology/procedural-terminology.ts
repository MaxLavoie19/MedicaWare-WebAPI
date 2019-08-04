import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ProceduralTerminologyDao } from "./procedural-terminology.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ProceduralTerminologyModule extends DataModule {
  protected dataAccessObject: ProceduralTerminologyDao;

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
    this.dataAccessObject = new ProceduralTerminologyDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/procedural-terminologies', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const proceduralTerminologysQueryObservable = from(this.dataAccessObject.fetchVisitProceduralTerminologys(visitId));
      const guid = this.eventDict.addEvent(proceduralTerminologysQueryObservable);
      response.send({ guid });
    });
  }
}
