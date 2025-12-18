"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Preferences() {
  const router = useRouter();
  return (
    <div>
      <h1>Preferences</h1>
      <Button onClick={() => router.push("/")}>Next</Button>
    </div>
  );
}
