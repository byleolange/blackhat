"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { parseCartolaInput } from "@/lib/cartola/parse";
import { useCartolaStore } from "@/lib/store/useCartolaStore";

export function ConnectTeamCard() {
  const setSlug = useCartolaStore((state) => state.setSlug);
  const [value, setValue] = React.useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conecte seu time</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Cole o link, nome ou ID do time"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          className="w-full"
          onClick={() => {
            const parsed = parseCartolaInput(value);
            if (!parsed) {
              toast({
                title: "Informe o time",
                description: "Cole o link, nome ou ID do seu time para conectar."
              });
              return;
            }
            setSlug(parsed);
          }}
        >
          Conectar
        </Button>
      </CardContent>
    </Card>
  );
}
