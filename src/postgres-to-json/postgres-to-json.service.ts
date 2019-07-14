import { Json } from "../types/json";
import { Client, Value } from "ts-postgres";

export class PostgresToJsonService {
  private mimicClient: Client;
  constructor(mimicClient: Client) {
    this.mimicClient = mimicClient;
  }

  async getDataset(): Promise<Json[]> {
    return [];
  }

  async getVisit(visitId: number): Promise<Json> {
    const admissions = await this.mimicClient.query(`
      SELECT *
      FROM noteevents
      WHERE row_id=$1
    `, [visitId]);
    const admissionObjects: Json[] = [];
    admissions.rows.forEach((row: Value[]) => {
      const admission: Json = {};
      admissions.names.forEach((name: string, index) => {
        admission[name] = row[index];
      });
      admissionObjects.push(admission);
    });
    return admissionObjects[0];
  }

  async getVisits(): Promise<Json[]> {
    const admissions = await this.mimicClient.query(`
      SELECT *
      FROM noteevents
    `);
    const admissionObjects: Json[] = [];
    admissions.rows.forEach((row: Value[]) => {
      const admission: Json = {};
      admissions.names.forEach((name: string, index) => {
        admission[name] = row[index];
      });
      admissionObjects.push(admission);
    });
    return admissionObjects;
  }
}
