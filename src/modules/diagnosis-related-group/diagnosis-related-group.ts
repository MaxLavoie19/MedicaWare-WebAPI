import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { DiagnosisRelatedGroupDao } from "./diagnosis-related-group.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class DiagnosisRelatedGroupModule extends DataModule {
  protected dataAccessObject: DiagnosisRelatedGroupDao;

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
    this.dataAccessObject = new DiagnosisRelatedGroupDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/diagnosis-related-groups', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const diagnosisRelatedGroupsQueryObservable = from(this.dataAccessObject.fetchVisitDiagnosisRelatedGroups(visitId));
      const guid = this.eventDict.addEvent(diagnosisRelatedGroupsQueryObservable);
      response.send({ guid });
    });
  }
}
