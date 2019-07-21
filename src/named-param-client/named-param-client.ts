import { Client, Configuration, Value, Result } from "ts-postgres";
import { Json } from "../types/json";

export class NamedParamClient extends Client {
  constructor(config: Configuration = {}) {
    config.preparedStatementPrefix = '$';
    super(config);
  }

  async namedParametersQuery(query: string, namedParameters?: {[name: string]: Value}): Promise<Json[]> {
    const parameterList: Value[] = [];

    let formatedQuery = query.trim();
    if (namedParameters) {
      Object.keys(namedParameters).forEach((key, index) => {
        parameterList.push(namedParameters[key]);
        const newIndex = index + 1;
        formatedQuery = formatedQuery.replace(`$(${key})`, `$${newIndex}`);
      });
    }
    const queryResult = await this.query(formatedQuery, parameterList);
    return this.resultToJson(queryResult);
  }

  private resultToJson(queryResult: Result): Json[] {
    if (!queryResult || !queryResult.rows || !queryResult.names) { return []; }
    const names = queryResult.names;
    const rowObjects: Json[] = [];
    queryResult.rows.forEach((row: Value[]) => {
      const rowObject: Json = {};
      names.forEach((name: string, index: number) => {
        rowObject[name] = row[index];
      });
      rowObjects.push(rowObject);
    });
    return rowObjects;
  }
}