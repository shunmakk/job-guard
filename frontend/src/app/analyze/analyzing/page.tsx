"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue } from "jotai";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { analyzeCompany } from "@/app/actions/fetchAnalysis";
import { inputInfoAtom } from "@/stores/inputInfoAtom";

const AnalyzingPage = () => {
  const router = useRouter();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);
  const inputInfo = useAtomValue(inputInfoAtom);

  useEffect(() => {
    if (hasRequest.current) return;

    // 入力情報がない場合はフォームページにリダイレクト
    if (!inputInfo.industry || !inputInfo.job_text) {
      router.push("/analyze");
      window.alert('入力情報がないため、入力ページにリダイレクトしました')
      return;
    }

    const performAnalysis = async () => {
      try {
        hasRequest.current = true;

        const result = await analyzeCompany({
          industry: inputInfo.industry,
          job_text: inputInfo.job_text,
        });

        if (result.success) {
          setResult(result.data);
          router.push("/analyze/result");
        } else {
          console.error("分析エラー:", result.error);
          router.push(`/analyze?error=${encodeURIComponent(result.error)}`);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
        hasRequest.current = false;
        router.push("/analyze?error=unexpected_error");
      }
    };

    performAnalysis();
  }, [inputInfo, router, setResult]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-pulse text-lg">AIが求人を分析中です…</div>
      <p className="text-sm text-muted-foreground mt-4">
        マッチング度とブラック企業リスクを判定中
      </p>
    </div>
  );
};

export default AnalyzingPage;
