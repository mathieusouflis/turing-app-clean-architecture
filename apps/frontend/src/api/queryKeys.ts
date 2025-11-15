export const TAGS = {
  turingMachine: {
    all: ["turing-machines"] as const,
    lists: () => [...TAGS.turingMachine.all, "list"] as const,
    details: () => [...TAGS.turingMachine.all, "detail"] as const,
    detail: (id: string) => [...TAGS.turingMachine.details(), id] as const,
  },
};
