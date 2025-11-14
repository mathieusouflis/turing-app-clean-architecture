import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import { RuleSchema, TransitionSchema } from "@repo/types";

import { z } from "zod";

export const turingMachine = pgTable("turing_machine", {
  id: uuid("id").primaryKey().defaultRandom(),
  tape: text("tape").notNull(),
  headPosition: integer("head_position").notNull().default(0),
  currentState: text("current_state").notNull(),
  transitions: jsonb("transitions")
    .$type<Array<z.infer<typeof TransitionSchema>>>()
    .notNull()
    .default([]),
  rules: jsonb("rules").$type<Array<z.infer<typeof RuleSchema>>>().notNull(),
  initialState: text("initial_state").notNull(),
  finalState: text("final_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TuringMachineRecord = typeof turingMachine.$inferSelect;
export type NewTuringMachineRecord = typeof turingMachine.$inferInsert;
