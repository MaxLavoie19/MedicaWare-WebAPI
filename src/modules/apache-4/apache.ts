import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { ApacheDao } from "./apache.dao";
import { NamedParamClientPool } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class ChartEventModule extends DataModule {
  protected dataAccessObject: ApacheDao;

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
    this.dataAccessObject = new ApacheDao(client);
  }

  init() {
    this.app.get('/apache', validateVisit, (_request: Request, response: Response) => {
      const apacheQueryObservable = from(this.dataAccessObject.fetchVisitApacheData());
      apacheQueryObservable.pipe(() => {

      })
      /*
        age,
        los,
        admissionDiagnosis,

        temperature,
        map,
        heartRate,
        respirationRate,
        fio,
        oxy,
        pco,
        arterialPh,
        nas,
        urea,
        creatine,
        urine,
        bsl,
        albumin,
        bilirubin,
        hto,
        wbc,
        gcEyes,
        gcVerbal,
        gcMotor,
        respiratoryQuotient,
        atmosphericPressure,
        origin,
        system,
        diagnosis,
        readmission,
        emergencySurgery,
        thrombolysis,
        crfHd,
        sed,
        isAidChecked,
        isHepChecked,
        isLymChecked,
        isMetChecked,
        isLeuChecked,
        isImmChecked,
        isCirChecked,
        ventilationMode,
      */
      const guid = this.eventDict.addEvent(apacheQueryObservable);
      response.send({ guid });
    });
  }
}
