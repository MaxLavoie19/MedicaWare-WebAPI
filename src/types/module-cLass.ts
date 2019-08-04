import { DataModule } from "../modules/data-module/data-module";
import express = require("express");
import { EventDictionary } from "../event-dictionary/event-dictionary";
import { NamedParamClientPool } from "../named-param-client/named-param-client";

export interface ModuleClass {
  new(
    app: express.Application,
    client: NamedParamClientPool,
    eventDict: EventDictionary,
    subModuleList?: DataModule[]
  ): DataModule;
}