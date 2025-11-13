import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Drizzle schema for the tapes table
 * Represents a Turing machine tape with its state and transitions
 */
export const tapes = pgTable("tapes", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(), 
  initialContent: text("initial_content").notNull(), 
  headPosition: integer("head_position").notNull().default(0), 
  currentState: text("current_state").notNull(), 
  transitions: jsonb("transitions")
    .$type<
      Array<{
        currentState: string;
        readSymbol: string;
        writeSymbol: string;
        moveDirection: "L" | "R";
        nextState: string;
      }>
    >()
    .notNull(), 
  initialState: text("initial_state").notNull(), 
  finalStates: text("final_states").array().notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type inference for the tapes table
export type TapeRecord = typeof tapes.$inferSelect;
export type NewTapeRecord = typeof tapes.$inferInsert;
