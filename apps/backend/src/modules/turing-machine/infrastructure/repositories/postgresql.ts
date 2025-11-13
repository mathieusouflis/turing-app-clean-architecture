import { getTableColumns } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { PostgresClient } from "@/utils/db/postgresql";
import {
  NewTuringMachineRecord,
  turingMachine,
  TuringMachineRecord,
} from "@/modules/index.schemas";

export class TuringMachineRepository extends PostgresClient {
  async create(data: NewTuringMachineRecord): Promise<TuringMachineRecord> {
    const [record] = await this.db
      .insert(turingMachine)
      .values(data)
      .returning();
    return record;
  }

  async get(id: string): Promise<TuringMachineRecord> {
    const [record] = await this.db
      .select({
        ...getTableColumns(turingMachine),
      })
      .from(turingMachine)
      .where(eq(turingMachine.id, id))
      .limit(1)
      .execute();
    return record;
  }

  getAll() {}

  update() {}

  delete() {}
}
