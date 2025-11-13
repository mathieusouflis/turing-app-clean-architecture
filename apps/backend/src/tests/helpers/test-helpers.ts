export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createMockTapeRecord(overrides: Partial<any> = {}): any {
  return {
    id: 'test-id',
    content: '______1',
    initialContent: '______1',
    headPosition: 0,
    currentState: 'A',
    initialState: 'A',
    finalStates: ['HALT'],
    transitions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
 
export function createMockTape(content: string = '______1', headPosition: number = 0) {
  return {
    content,
    headPosition,
    getContent: () => content,
    getHeadPosition: () => headPosition,
    read: () => content[headPosition] || '_',
  };
}

