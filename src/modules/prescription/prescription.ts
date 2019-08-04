import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { PrescriptionDao } from "./prescription.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class PrescriptionModule extends DataModule {
  protected dataAccessObject: PrescriptionDao;

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
    this.dataAccessObject = new PrescriptionDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/prescriptions', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const prescriptionsQueryObservable = from(this.dataAccessObject.fetchVisitPrescriptions(visitId));
      const guid = this.eventDict.addEvent(prescriptionsQueryObservable);
      response.send({ guid });
    });
    this.app.get('/visit/:visitId/prescription-groups', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const prescriptionGroupsQueryObservable = from(this.dataAccessObject.fetchVisitPrescriptionGroups(visitId));
      const guid = this.eventDict.addEvent(prescriptionGroupsQueryObservable);
      response.send({ guid });
    });
  }
}
