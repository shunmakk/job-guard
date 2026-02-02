"use client";
import { atom } from "jotai";

export const analysisResultAtom = atom<{
  score: number;
  reason: string;
} | null>(null);
