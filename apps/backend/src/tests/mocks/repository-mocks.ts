import type { DatabaseClient } from '../../utils/db/postgresql';

export class MockTapeRepository {
  public db?: DatabaseClient;
  private tapes: Map<string, any> = new Map();
  private nextId: number = 1;

  constructor(db?: DatabaseClient) {
    this.db = db;
  }

  async create(data: any): Promise<any> {
    const id = `mock-id-${this.nextId++}`;
    const tape = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tapes.set(id, tape);
    return tape;
  }

  async findById(id: string): Promise<any> {
    return this.tapes.get(id) || null;
  }

  async findAll(): Promise<any[]> {
    return Array.from(this.tapes.values());
  }

  async update(id: string, data: Partial<any>): Promise<any> {
    const tape = this.tapes.get(id);
    if (!tape) {
      return null;
    }
    const updated = {
      ...tape,
      ...data,
      updatedAt: new Date(),
    };
    this.tapes.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (!this.tapes.has(id)) {
      return false;
    }
    this.tapes.delete(id);
    return true;
  }

  async initialize(): Promise<void> {
  }

  clear(): void {
    this.tapes.clear();
    this.nextId = 1;
  }

  seed(tapes: any[]): void {
    tapes.forEach(tape => {
      this.tapes.set(tape.id, tape);
    });
  }
}

