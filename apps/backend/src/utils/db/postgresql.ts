import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../modules/index.schemas";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let postgresClient: ReturnType<typeof postgres> | null = null;

export class PostgresClient {
  public db: PostgresJsDatabase<Record<string, unknown>> & {
    $client: postgres.Sql<{}>;
  };
  private user: string;
  private password: string;
  private host: string;
  private port: number;
  private databaseName: string;
  private connectionString: string;

  constructor(config: {
    user: string;
    password: string;
    host: string;
    port: number;
    databaseName: string;
  }) {
    this.user = config.user;
    this.password = config.password;
    this.host = config.host;
    this.port = config.port;
    this.databaseName = config.databaseName;
    this.connectionString = `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.databaseName}`;
    this.db = this.initialise();
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
