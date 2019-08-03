import { from } from "rxjs";

import { DataModule } from "../data-module/data-module";
import { EventDictionary } from "../../event-dictionary/event-dictionary";
import { NoteDao } from "./note.dao";
import { NamedParamClient } from "../../named-param-client/named-param-client";
import { validateVisit } from "../../mixin/visit-validator";
import { Application, Response } from "express";
import { Request } from "express-serve-static-core";

export class NoteModule extends DataModule {
  protected dataAccessObject: NoteDao;

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
    this.dataAccessObject = new NoteDao(client);
  }

  init() {
    this.app.get('/visit/:visitId/notes', validateVisit, (request: Request, response: Response) => {
      const visitId = Number(request.params.visitId);
      const notesQueryObservable = from(this.dataAccessObject.fetchVisitNotes(visitId));
      const guid = this.eventDict.addEvent(notesQueryObservable);
      response.send({ guid });
    });
  }
}
