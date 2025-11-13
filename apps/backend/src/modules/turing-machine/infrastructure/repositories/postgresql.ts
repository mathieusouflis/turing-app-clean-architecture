import { getTableColumns } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { PostgresClient } from "@/utils/db/postgresql";
import {
  NewTuringMachineRecord,
  turingMachine,
  TuringMachineRecord,
} from "@/modules/index.schemas";
import { ITuringMachineRepository } from "../interface";
import { dbConfig } from "@/config/db.config";

export class TuringMachineRepository
  extends PostgresClient
  implements ITuringMachineRepository
{
  constructor() {
    super(dbConfig);
  }

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

  async getAll(): Promise<TuringMachineRecord[]> {
    const records = await this.db
      .select({
        ...getTableColumns(turingMachine),
      })
      .from(turingMachine)
      .execute();
    return records;
  }

  async update(id: string, data: Partial<TuringMachineRecord>) {
    await this.db
      .update(turingMachine)
      .set(data)
      .where(eq(turingMachine.id, id))
      .execute();

    return this.get(id);
  }

  async delete(id: string) {
    await this.db
      .delete(turingMachine)
      .where(eq(turingMachine.id, id))
      .execute();
  }
}
