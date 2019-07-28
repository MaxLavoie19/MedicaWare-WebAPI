import { ServerModule } from "../server-module/server-module";
import express = require("express");
import { EventDictionary } from "../event-dictionary/event-dictionary";
import { NamedParamClient } from "../named-param-client/named-param-client";

export interface ModuleClass {
  new(
    app: express.Application,
    client: NamedParamClient,
    eventDict: EventDictionary,
    subModuleList?: ServerModule[]
  ): ServerModule;
}