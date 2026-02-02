"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { analyzeCompany } from "@/api/fetchAnalysis";
import { inputInfoAtom } from "@/stores/inputInfoAtom";
import { useAtomValue } from "jotai";

const AnalyzingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);
  const inputInfo = useAtomValue(inputInfoAtom);

  useEffect(() => {
    if (hasRequest.current) return;

    const performAnalysis = async () => {
      try {
        hasRequest.current = true;

        const result = await analyzeCompany({
          id: inputInfo.id,
          salary_min: inputInfo.salary_min,
          salary_max: inputInfo.salary_max,
          holiday: inputInfo.holiday,
          description: inputInfo.description,
        });

        if (result.success) {
          setResult(result.data);
          router.push("/analyze/result");
        } else {
          console.error("分析エラー:", result.error);
          router.push("/analyze?error=analysis_failed");
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
        hasRequest.current = false;
        router.push("/analyze?error=unexpected_error");
      }
    };

    performAnalysis();
  }, [searchParams, router, setResult]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-pulse text-lg">AIが求人を分析中です…🤖💭</div>
    </div>
  );
};

export default AnalyzingPage;
