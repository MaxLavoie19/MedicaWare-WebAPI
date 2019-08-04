import { Json } from "../types/json";
import { NamedParamClientPool } from "../named-param-client/named-param-client";

export class DataAccessObject {
  constructor(protected client: NamedParamClientPool) { }

  async getRow(tableName: string, rowId: number): Promise<Json> {
    const queryResult = await this.client.namedParametersQuery(`
        SELECT *
        FROM ${tableName}
        WHERE row_id=$(rowId)
      `,
      { rowId }
    );
    return queryResult[0];
  }

  getTable(tableName: string): Promise<Json[]> {
    return this.client.namedParametersQuery(`
      SELECT *
      FROM ${tableName}
    `);
  }
}
