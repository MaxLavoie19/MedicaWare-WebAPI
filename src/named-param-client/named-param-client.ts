import { Client, Configuration, Value, Result } from "ts-postgres";
import { createPool, Pool, Options } from 'generic-pool';
import { Json } from "../types/json";

export class NamedParamClientPool {
  private pool: Pool<Client>;
  private max = 10;

  constructor(config: Configuration = {}, poolOptions: Options) {
    config.preparedStatementPrefix = '$';
    if (!poolOptions.max) {
      poolOptions.max = this.max;
    } else {
      this.max = poolOptions.max;
    }

    this.pool = createPool({
      create: async () => {
        const client = new Client(config);
        client.on('error', console.log);
        await client.connect();
        return client;
      },
      validate: (client: Client) => {
        return Promise.resolve(!client.closed);
      },
      destroy: async (client: Client) => {
        await client.end();
      },
    }, poolOptions);
  }

  async namedParametersQuery(query: string, namedParameters?: { [name: string]: Value }): Promise<Json[]> {
    const parameterList: Value[] = [];

    let formatedQuery = query.trim();
    if (namedParameters) {
      Object.keys(namedParameters).forEach((key, index) => {
        parameterList.push(namedParameters[key]);
        const newIndex = index + 1;
        formatedQuery = formatedQuery.replace(`$(${key})`, `$${newIndex}`);
      });
    }

    const client = await this.pool.acquire();
    const queryResult = await client.query(formatedQuery, parameterList);
    this.pool.release(client);
    return this.resultToJson(queryResult);
  }

  private resultToJson(queryResult: Result): Json[] {
    if (!queryResult || !queryResult.rows || !queryResult.names) { return []; }
    const names = queryResult.names;
    const rowObjects: Json[] = [];
    queryResult.rows.forEach((row: Value[]) => {
      const rowObject: Json = {};
      names.forEach((name: string, index: number) => {
        rowObject[name] = row[index];
      });
      rowObjects.push(rowObject);
    });
    return rowObjects;
  }
}