"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartolaStore } from "@/lib/store/useCartolaStore";



export function ViewModeToggle() {
  const viewMode = useCartolaStore((state) => state.viewMode);
  const setViewMode = useCartolaStore((state) => state.setViewMode);

  const handleChange = (value: string) => {
    if (value === "list" || value === "field") {
      setViewMode(value);
    }
  };

  return (
    <Tabs value={viewMode} onValueChange={handleChange}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger className="flex-1 sm:flex-none" value="list">
          Lista
        </TabsTrigger>
        <TabsTrigger className="flex-1 sm:flex-none" value="field">
          Campo
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
