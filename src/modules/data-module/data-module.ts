import express = require("express");

import { DataAccessObject } from "../../data-access-object/data-access-object";
import { EventDictionary } from "../../event-dictionary/event-dictionary";

export abstract class DataModule {
  protected abstract dataAccessObject: DataAccessObject;

  constructor(
    protected app: express.Application,
    protected eventDict: EventDictionary,
    protected subModuleList?: DataModule[]
  ) { }

  abstract init(): void;
}