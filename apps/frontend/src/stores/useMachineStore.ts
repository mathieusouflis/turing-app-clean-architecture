import { create } from 'zustand';

interface MachineState {
  tapeId: string | null;
  setTapeId: (id: string | null) => void;
}

export const useMachineStore = create<MachineState>((set) => ({
  tapeId: null,
  setTapeId: (id) => set({ tapeId: id }),
}));
