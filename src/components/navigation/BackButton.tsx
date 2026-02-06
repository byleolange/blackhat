"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type BackButtonProps = {
  href?: string;
  label?: string;
};

export function BackButton({ href = "/", label = "Voltar" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button variant="ghost" size="sm" onClick={() => router.push(href)}>
      {label}
    </Button>
  );
}
