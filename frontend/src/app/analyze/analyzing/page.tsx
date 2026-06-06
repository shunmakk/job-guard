"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAnalyzeCompany } from "@/hooks/useAnalyzeCompany";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { inputInfoAtom } from "@/stores/inputInfoAtom";
import {
  analysisPromises,
  buildAnalysisRequestKey,
} from "@/lib/analysisSession";
import { analyzeCompany } from "@/app/actions/fetchAnalysis";

const AnalyzingPage = () => {
  const router = useRouter();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);
  const inputInfo = useAtomValue(inputInfoAtom);
  const { mutate } = useAnalyzeCompany();

  useEffect(() => {
    // 入力情報がない場合はフォームページにリダイレクト
    if (!inputInfo.industry || !inputInfo.job_text) {
      router.push("/analyze");
      window.alert("入力情報がないため、入力ページにリダイレクトしました");
      return;
    }

    const requestKey = buildAnalysisRequestKey(
      inputInfo.industry,
      inputInfo.job_text,
    );

    if (!analysisPromises.has(requestKey)) {
      analysisPromises.set(
        requestKey,
        analyzeCompany({
          industry: inputInfo.industry,
          job_text: inputInfo.job_text,
        }),
      );
    }

    let active = true;

    const promise = analysisPromises.get(requestKey)!;
    promise
      .then((result) => {
        if (!active) return;
        if (result.success) {
          setResult(result.data);
          router.replace("/analyze/result");
        } else {
          router.replace(`/analyze?error=${encodeURIComponent(result.error)}`);
        }
      })
      .catch((err) => {
        if (!active) return;
        router.replace("/analyze?error=unexpected_error");
        window.alert(
          `分析中にエラーが発生しました: ${err instanceof Error ? err.message : "不明なエラー"}`,
        );
      });

    return () => {
      active = false;
    };
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
