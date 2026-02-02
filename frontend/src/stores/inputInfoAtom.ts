"use client";
import { atom } from "jotai";

export const inputInfoAtom = atom<{
  id: string;
  salary_min: number;
  salary_max: number;
  holiday: number;
  description: string;
}>({
  id: "",
  salary_min: 0,
  salary_max: 0,
  holiday: 0,
  description: "",
});
