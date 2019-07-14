import { Value } from "ts-postgres";

export interface Json {
    [name: string]: Value;
}