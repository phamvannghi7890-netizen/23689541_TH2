// In-memory persistent storage adapter for Zustand
const inMemoryFallback = new Map<string, string>();

export const safeStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return inMemoryFallback.get(name) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    inMemoryFallback.set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    inMemoryFallback.delete(name);
  },
};
