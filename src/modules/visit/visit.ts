import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import express = require("express");
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { VisitDao } from "./visit.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit as validateVisitId } from "../../mixin/visit-validator";
import { Request, Response } from "express-serve-static-core";

export class VisitModule extends DataModule {
  protected dataAccessObject: VisitDao;

  constructor(
    app: express.Application,
    client: NamedParamClient,
    eventDict: EventDictionary,
    subModuleList?: DataModule[]
  ) {
    super(
      app,
      eventDict,
      subModuleList
    );
    this.dataAccessObject = new VisitDao(client);
  }

  init() {
    this.app.get('/visit/:visitId', validateVisitId, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const visitsQueryObservable = from(this.dataAccessObject.fetchVisit(visitId));
      const guid = this.eventDict.addEvent(visitsQueryObservable);
      response.send({ guid });
    });

    this.app.get('/visits', (_request: Request, response: Response) => {
      const visitsQueryObservable = from(this.dataAccessObject.getTable('admissions'));
      const guid = this.eventDict.addEvent(visitsQueryObservable);
      response.send({ guid });
    });
  }
}
