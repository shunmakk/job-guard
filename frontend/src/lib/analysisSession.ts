import { analyzeCompany } from "@/app/actions/fetchAnalysis";

export type AnalysisResponse = Awaited<ReturnType<typeof analyzeCompany>>;

//キーごとに「進行中の分析」を1つだけ保持するpromise関数
export const analysisPromises = new Map<string, Promise<AnalysisResponse>>();

export function buildAnalysisRequestKey(industry: string, jobText: string) {
  return `${industry}\0${jobText}`;
}

export function resetAnalysisSession() {
  analysisPromises.clear();
}
