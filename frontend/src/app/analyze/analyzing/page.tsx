"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAnalyzeCompany } from "@/hooks/useAnalyzeCompany";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { inputInfoAtom } from "@/stores/inputInfoAtom";

const AnalyzingPage = () => {
  const router = useRouter();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);
  const inputInfo = useAtomValue(inputInfoAtom);
  const { mutate } = useAnalyzeCompany();

  useEffect(() => {
    if (hasRequest.current) return;

    // 入力情報がない場合はフォームページにリダイレクト
    if (!inputInfo.industry || !inputInfo.job_text) {
      router.push("/analyze");
      window.alert("入力情報がないため、入力ページにリダイレクトしました");
      return;
    }

    hasRequest.current = true;

    mutate(
      { industry: inputInfo.industry, job_text: inputInfo.job_text },
      {
        onSuccess: (result) => {
          if (result.success) {
            setResult(result.data);
            router.push("/analyze/result");
          } else {
            router.push(`/analyze?error=${encodeURIComponent(result.error)}`);
          }
        },
        onError: (err) => {
          router.push("/analyze?error=unexpected_error");
          window.alert(`分析中にエラーが発生しました: ${err.message}`);
        },
      },
    );
  }, [inputInfo.industry, inputInfo.job_text, mutate, router, setResult]);

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
