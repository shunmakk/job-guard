"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom, useAtomValue } from "jotai";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { inputInfoAtom } from "@/stores/inputInfoAtom";
import { useAnalyzeCompany } from "@/hooks/useAnalyzeCompany";

const AnalyzingPage = () => {
  const router = useRouter();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);
  const inputInfo = useAtomValue(inputInfoAtom);
  const {mutate,isPending,isError,error} = useAnalyzeCompany();

  useEffect(() => {
    if (hasRequest.current) return;

    // 入力情報がない場合はフォームページにリダイレクト
    if (!inputInfo.industry || !inputInfo.job_text) {
      router.push("/analyze");
      window.alert('入力情報がないため、入力ページにリダイレクトしました')
      return;
    }
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
          window.alert('分析中にエラーが発生しました: ' + err.message);
        },
      }
    );
  }, []);

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
