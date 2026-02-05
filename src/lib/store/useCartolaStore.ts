import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartolaState = {
  slug: string | null;
  lastUpdated: number | null;
  viewMode: "list" | "field";
  setSlug: (slug: string) => void;
  clearSlug: () => void;
  setLastUpdated: (timestamp: number) => void;
  setViewMode: (mode: "list" | "field") => void;
};

export const useCartolaStore = create<CartolaState>()(
  persist(
    (set) => ({
      slug: null,
      lastUpdated: null,
      viewMode: "list",
      setSlug: (slug) => set({ slug }),
      clearSlug: () => set({ slug: null, lastUpdated: null }),
      setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),
      setViewMode: (viewMode) => set({ viewMode })
    }),
    {
      name: "cartola-minimal",
      version: 1,
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch {
          return {
            state: { slug: null, lastUpdated: null, viewMode: "list" },
            version: 1
          };
        }
      }
    }
  )
);
