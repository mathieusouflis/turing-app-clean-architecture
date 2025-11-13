import { NewTapeRecord, TapeRecord, tapes } from "../../shemas/tape";
import { getTableColumns } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { PostgresClient } from "@/utils/db/postgresql";

export class TapeRepository extends PostgresClient {
  async create(data: NewTapeRecord): Promise<TapeRecord> {
    const [record] = await this.db.insert(tapes).values(data).returning();
    return record;
  }

  async get(id: string): Promise<TapeRecord> {
    const [record] = await this.db
      .select({
        ...getTableColumns(tapes),
      })
      .from(tapes)
      .where(eq(tapes.id, id))
      .limit(1)
      .execute();
    return record;
  }

  getAll() {}

  update() {}

  delete() {}
}
