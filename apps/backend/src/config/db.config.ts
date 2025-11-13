export const dbConfig = {
  user: process.env.DB_USER || "root",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "root",
  port: Number(process.env.DB_PORT) || 5432,
  databaseName: process.env.DB_NAME || "postgres",
} as const;
