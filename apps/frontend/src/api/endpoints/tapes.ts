import { apiRequest } from '../client.ts';

export interface Tape {
  id: string;
  content: string;
  initialContent: string; 
  headPosition: number;
  currentState: string;
  transitions: Array<{
    currentState: string;
    readSymbol: string;
    writeSymbol: string;
    moveDirection: 'L' | 'R';
    nextState: string;
  }>;
  initialState: string;
  finalStates: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RunMachineResponse extends Tape {
  stepsExecuted: number;
}

export interface StepErrorResponse {
  error?: string;
  message?: string;
  currentState?: string;
  readSymbol?: string;
}

export function createTape(body?: Partial<{
  content: string;
  initialContent: string;
  headPosition: number;
  currentState: string;
  initialState: string;
  transitions: Tape['transitions'];
  finalStates: string[];
}>): Promise<Tape> {
  return apiRequest<Tape>('/tapes', {
    method: 'POST',
    body: body ? JSON.stringify(body) : JSON.stringify({}),
  });
}

export function getTape(id: string): Promise<Tape> {
  return apiRequest<Tape>(`/tapes/${id}`);
}

export function getAllTapes(): Promise<Tape[]> {
  return apiRequest<Tape[]>('/tapes');
}

export function executeStep(id: string): Promise<Tape | (Tape & { message: string }) | StepErrorResponse> {
  return apiRequest<Tape | (Tape & { message: string }) | StepErrorResponse>(`/tapes/${id}/step`, {
    method: 'PUT',
    body: JSON.stringify({}),
  });
}

export function runMachine(id: string, maxSteps?: number): Promise<RunMachineResponse> {
  return apiRequest<RunMachineResponse>(`/tapes/${id}/run`, {
    method: 'PUT',
    body: JSON.stringify({ maxSteps: maxSteps || 10 }),
  });
}

export function resetTape(
  id: string,
  body?: { content?: string; headPosition?: number }
): Promise<Tape> {
  return apiRequest<Tape>(`/tapes/${id}/reset`, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : JSON.stringify({}),
  });
}

export function deleteTape(id: string): Promise<void> {
  return apiRequest<void>(`/tapes/${id}`, {
    method: 'DELETE',
  });
}
