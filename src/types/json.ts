import { Value } from "ts-postgres";
import { Observable } from "rxjs";

export interface Json {
    [name: string]: Value | Json[] | Observable<Json[]> | Observable<Json>;
}