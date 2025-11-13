import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import z from "zod";

export const turingMachine = pgTable("turing_machine", {
  id: uuid("id").primaryKey().defaultRandom(),
  tape: text("tape").notNull(),
  headPosition: integer("head_position").notNull().default(0),
  currentState: text("current_state").notNull(),
  transitions: jsonb("transitions")
    .$type<
      Array<{
        currentState: string;
        readSymbol: string;
        writeSymbol: string;
        moveDirection: "left" | "right" | "stop";
        nextState: string;
      }>
    >()
    .notNull(),
  rules: jsonb("rules")
    .$type<
      Array<{
        state: string;
        output: string;
        direction: "left" | "right" | "stop";
        nextState: string;
      }>
    >()
    .notNull(),
  initialState: text("initial_state").notNull(),
  finalState: text("final_state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TuringMachineRecord = typeof turingMachine.$inferSelect;
export type NewTuringMachineRecord = typeof turingMachine.$inferInsert;

export const TuringMachineRecordSchema = z.object({
  id: z.string().uuid(),
  tape: z.string(),
  headPosition: z.number(),
  currentState: z.string(),
  transitions: z.array(
    z.object({
      currentState: z.string(),
      readSymbol: z.string(),
      writeSymbol: z.string(),
      moveDirection: z.enum(["left", "right", "stop"]),
      nextState: z.string(),
    }),
  ),
  rules: z.array(
    z.object({
      state: z.string(),
      output: z.string(),
      direction: z.enum(["left", "right", "stop"]),
      nextState: z.string(),
    }),
  ),
  initialState: z.string(),
  finalState: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const NewTuringMachineRecordSchema = z.object({
  id: z.string().uuid().optional(),
  tape: z.string(),
  headPosition: z.number().optional(),
  currentState: z.string(),
  transitions: z.array(
    z.object({
      currentState: z.string(),
      readSymbol: z.string(),
      writeSymbol: z.string(),
      moveDirection: z.enum(["left", "right", "stop"]),
      nextState: z.string(),
    }),
  ),
  rules: z.array(
    z.object({
      state: z.string(),
      output: z.string(),
      direction: z.enum(["left", "right", "stop"]),
      nextState: z.string(),
    }),
  ),
  initialState: z.string(),
  finalState: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateTuringMachineRecordSchema = z.object({
  id: z.string().uuid().optional(),
  tape: z.string().optional(),
  headPosition: z.number().optional(),
  currentState: z.string().optional(),
  transitions: z
    .array(
      z.object({
        currentState: z.string(),
        readSymbol: z.string(),
        writeSymbol: z.string(),
        moveDirection: z.enum(["left", "right", "stop"]),
        nextState: z.string(),
      }),
    )
    .optional(),
  rules: z
    .array(
      z.object({
        state: z.string(),
        output: z.string(),
        direction: z.enum(["left", "right", "stop"]),
        nextState: z.string(),
      }),
    )
    .optional(),
  initialState: z.string().optional(),
  finalState: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
