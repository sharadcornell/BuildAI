"use client";
import { useState } from "react";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export function useSubmit(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");

  async function submit(data: unknown): Promise<boolean> {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return false;
      }
      setStatus("success");
      return true;
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      return false;
    }
  }

  return { status, error, submit };
}
