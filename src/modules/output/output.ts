import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { OutputDao } from "./output.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class OutputModule extends DataModule {
  protected dataAccessObject: OutputDao;

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
    this.dataAccessObject = new OutputDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/outputs', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const outputsQueryObservable = from(this.dataAccessObject.fetchVisitOutputs(visitId));
      const guid = this.eventDict.addEvent(outputsQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/output-groups', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const outputGroupsQueryObservable = from(this.dataAccessObject.fetchVisitOutputGroups(visitId));
      const guid = this.eventDict.addEvent(outputGroupsQueryObservable);
      response.send({ guid });
    });
  }
}
