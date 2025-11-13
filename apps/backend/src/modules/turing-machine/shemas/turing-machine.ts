import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { z } from "zod";

const DirectionEnum = z.enum(["left", "right", "stop"]);

const TransitionSchema = z.object({
  currentState: z.string().min(1, "Current state cannot be empty"),
  readSymbol: z.string().length(1, "Read symbol must be a single character"),
  writeSymbol: z.string().length(1, "Write symbol must be a single character"),
  moveDirection: DirectionEnum,
  nextState: z.string().min(1, "Next state cannot be empty"),
});

const RuleSchema = z.object({
  state: z.string().min(1, "State cannot be empty"),
  input: z.string().length(1, "Input must be a single character"),
  output: z.string().length(1, "Output must be a single character"),
  direction: DirectionEnum,
  nextState: z.string().min(1, "Next state cannot be empty"),
});

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
export type Transition = z.infer<typeof TransitionSchema>;
export type Rule = z.infer<typeof RuleSchema>;

export const TuringMachineRecordSchema = z.object({
  id: z.string().uuid(),
  tape: z.string().min(1, "Tape cannot be empty"),
  headPosition: z.number().int().min(0, "Head position must be non-negative"),
  currentState: z.string().min(1, "Current state cannot be empty"),
  transitions: z.array(TransitionSchema),
  rules: z.array(RuleSchema).min(1, "At least one rule is required"),
  initialState: z.string().min(1, "Initial state cannot be empty"),
  finalState: z.string().min(1, "Final state cannot be empty"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const NewTuringMachineRecordSchema = z.object({
  id: z.string().uuid().optional(),
  tape: z.string().min(1, "Tape cannot be empty"),
  headPosition: z.number().int().min(0).default(0),
  currentState: z.string().min(1, "Current state cannot be empty"),
  transitions: z.array(TransitionSchema).default([]),
  rules: z.array(RuleSchema).min(1, "At least one rule is required"),
  initialState: z.string().min(1, "Initial state cannot be empty"),
  finalState: z.string().min(1, "Final state cannot be empty"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateTuringMachineRecordSchema = z.object({
  id: z.string().uuid().optional(),
  tape: z.string().min(1, "Tape cannot be empty").optional(),
  headPosition: z
    .number()
    .int()
    .min(0, "Head position must be non-negative")
    .optional(),
  currentState: z.string().min(1, "Current state cannot be empty").optional(),
  transitions: z.array(TransitionSchema).optional(),
  rules: z.array(RuleSchema).min(1, "At least one rule is required").optional(),
  initialState: z.string().min(1, "Initial state cannot be empty").optional(),
  finalState: z.string().min(1, "Final state cannot be empty").optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
