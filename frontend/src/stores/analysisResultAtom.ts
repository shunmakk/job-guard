"use client";
import { atom } from "jotai";

export interface AnalysisResult {
  job_post_id: string;
  matching_score: number;
  matching_reason: string;
  black_risk_score: number;
  black_risk_reason: string;
}

export const analysisResultAtom = atom<AnalysisResult | null>(null);
