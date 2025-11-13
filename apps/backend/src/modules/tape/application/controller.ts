import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { TapeRepository } from "../infrastructure/repositories/postgresql";
import { TapeDomain } from "../domains/tape";
import { NewTapeRecord, TapeRecord } from "../shemas/tape";

const DEFAULT_TAPE = {
  content: "______1",
  headPosition: 0,
  currentState: "A",
  initialState: "A",
  transitions: [
    { currentState: "A", readSymbol: "_", writeSymbol: "1", moveDirection: "R" as const, nextState: "A" },
    { currentState: "A", readSymbol: "1", writeSymbol: "1", moveDirection: "R" as const, nextState: "HALT" },
  ],
  finalStates: ["HALT"],
};

export class TapeController {
  private repository: TapeRepository;

  constructor() {
    this.repository = new TapeRepository(
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "postgres",
      process.env.DB_HOST || "localhost",
      Number(process.env.DB_PORT) || 5432,
      process.env.DB_NAME || "turing_machine",
    );
  }

  private async handleError(reply: FastifyReply, error: any, code = 500) {
    return reply.code(code).send({ error: error.message });
  }

  private async getTapeOr404(id: string, reply: FastifyReply): Promise<TapeRecord | null> {
    const record = await this.repository.get(id);
    if (!record) {
      reply.code(404).send({ error: "Tape not found" });
      return null;
    }
    return record;
  }

  private executeTransition(tapeDomain: TapeDomain, record: TapeRecord, head: number, state: string) {
    const symbol = tapeDomain.getCell(head);
    const rule = record.transitions.find((t: any) => t.currentState === state && t.readSymbol === symbol);
    if (!rule) return null;

    tapeDomain.write(head, rule.writeSymbol);
    return {
      head: head + (rule.moveDirection === "R" ? 1 : -1),
      state: rule.nextState,
    };
  }


  private async createTape(
    request: FastifyRequest<{ Body?: Partial<NewTapeRecord> | null }>,
    reply: FastifyReply,
  ) {
    try {
      const body = request.body || {};
      const content = body.content || DEFAULT_TAPE.content;
      const tapeData: NewTapeRecord = {
        content,
        initialContent: body.initialContent || content,
        headPosition: body.headPosition ?? DEFAULT_TAPE.headPosition,
        currentState: body.currentState || DEFAULT_TAPE.currentState,
        initialState: body.initialState || DEFAULT_TAPE.initialState,
        transitions: (body.transitions as any) || DEFAULT_TAPE.transitions,
        finalStates: body.finalStates || DEFAULT_TAPE.finalStates,
      };
      return reply.code(201).send(await this.repository.create(tapeData));
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async getTape(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const record = await this.getTapeOr404(request.params.id, reply);
      return record ? reply.send(record) : null;
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async getAllTapes(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await this.repository.getAll());
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async executeStep(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const record = await this.getTapeOr404(request.params.id, reply);
      if (!record) return null;

      if (record.finalStates.includes(record.currentState)) {
        return reply.send({ ...record, message: "Machine already in final state" });
      }

      const tapeDomain = new TapeDomain(record.content);
      const result = this.executeTransition(tapeDomain, record, record.headPosition, record.currentState);

      if (!result) {
        return reply.code(400).send({
          error: "No matching transition rule found",
          currentState: record.currentState,
          readSymbol: tapeDomain.getCell(record.headPosition),
        });
      }

      const updated = await this.repository.update(request.params.id, {
        content: tapeDomain.getTape().join(""),
        headPosition: result.head,
        currentState: result.state,
      });

      return reply.send(updated);
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async runMachine(
    request: FastifyRequest<{ Params: { id: string }; Body?: { maxSteps?: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const record = await this.getTapeOr404(request.params.id, reply);
      if (!record) return null;

      const tapeDomain = new TapeDomain(record.content);
      let head = record.headPosition;
      let state = record.currentState;
      let stepsExecuted = 0;
      const maxSteps = request.body?.maxSteps || 10;

      while (stepsExecuted < maxSteps && !record.finalStates.includes(state)) {
        const result = this.executeTransition(tapeDomain, record, head, state);
        if (!result) break;
        head = result.head;
        state = result.state;
        stepsExecuted++;
      }

      const updated = await this.repository.update(request.params.id, {
        content: tapeDomain.getTape().join(""),
        headPosition: head,
        currentState: state,
      });

      return reply.send({ ...updated, stepsExecuted });
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async resetTape(
    request: FastifyRequest<{ Params: { id: string }; Body?: { content?: string; headPosition?: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const record = await this.getTapeOr404(request.params.id, reply);
      if (!record) return null;

      const content = request.body?.content || (record as any).initialContent || record.content || DEFAULT_TAPE.content;
      const updated = await this.repository.update(request.params.id, {
        content,
        headPosition: request.body?.headPosition ?? 0,
        currentState: record.initialState,
      });

      return reply.send(updated);
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  private async deleteTape(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const record = await this.getTapeOr404(request.params.id, reply);
      if (!record) return null;

      await this.repository.delete(request.params.id);
      return reply.code(204).send();
    } catch (error: any) {
      return this.handleError(reply, error);
    }
  }

  public registerRoutes(fastify: FastifyInstance, ops: any, done: any) {
    fastify.post(
      "/",
      {
        schema: {
          body: {
            oneOf: [
              { type: "object", additionalProperties: true },
              { type: "null" },
            ],
          },
        },
      },
      this.createTape.bind(this),
    );
    fastify.get("/:id", this.getTape.bind(this));
    fastify.get("/", this.getAllTapes.bind(this));
    fastify.put("/:id/step", this.executeStep.bind(this));
    fastify.put("/:id/run", this.runMachine.bind(this));
    fastify.put("/:id/reset", this.resetTape.bind(this));
    fastify.delete("/:id", this.deleteTape.bind(this));

    done();
  }
}
