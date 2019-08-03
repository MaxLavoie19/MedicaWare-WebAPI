import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ProcedureDao } from "./procedure.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ProcedureModule extends DataModule {
  protected dataAccessObject: ProcedureDao;

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
    this.dataAccessObject = new ProcedureDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/procedures', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const proceduresQueryObservable = from(this.dataAccessObject.fetchVisitProcedures(visitId));
      const guid = this.eventDict.addEvent(proceduresQueryObservable);
      response.send({ guid });
    });
  }
}
