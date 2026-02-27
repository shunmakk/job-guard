
import { useMutation } from "@tanstack/react-query";
import { analyzeCompany } from "@/app/actions/fetchAnalysis";

export const useAnalyzeCompany = () => {
  return useMutation({
    mutationFn: analyzeCompany,
    retry: false, //再実行は不要のためリトライは無効化
  });
};