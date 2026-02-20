"use client";
import { atom } from "jotai";

export interface InputInfo {
  industry: string;
  job_text: string;
}

export const inputInfoAtom = atom<InputInfo>({
  industry: "",
  job_text: "",
});
