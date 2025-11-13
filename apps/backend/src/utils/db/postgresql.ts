import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../modules/index.schemas";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let postgresClient: ReturnType<typeof postgres> | null = null;

export class PostgresClient {
  public db: any;
  private username: string;
  private password: string;
  private host: string;
  private port: number;
  private bddName: string;
  private connectionString: string;

  constructor(
    username: string,
    password: string,
    host: string,
    port: number,
    bddName: string,
  ) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.port = port;
    this.bddName = bddName;
    this.connectionString = `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.bddName}`;
    this.initialise();
  }
  initialise() {
    if (dbInstance && postgresClient) {
      return dbInstance;
    }

    postgresClient = postgres(this.connectionString);
    dbInstance = drizzle(postgresClient, { schema });

    return dbInstance;
  }
}

export type DatabaseClient = PostgresJsDatabase<Record<string, unknown>> & {
  $client: postgres.Sql<{}>;
};
