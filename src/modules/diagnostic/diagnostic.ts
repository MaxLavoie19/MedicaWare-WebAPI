import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { DiagnosticDao } from "./diagnostic.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class DiagnosticModule extends DataModule {
  protected dataAccessObject: DiagnosticDao;

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
    this.dataAccessObject = new DiagnosticDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/diagnostics', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const diagnosticsQueryObservable = from(this.dataAccessObject.fetchVisitDiagnostics(visitId));
      const guid = this.eventDict.addEvent(diagnosticsQueryObservable);
      response.send({ guid });
    });
  }
}
