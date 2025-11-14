"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSetAtom } from "jotai";
import { analysisResultAtom } from "@/lib/atom";

const AnalyzingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setResult = useSetAtom(analysisResultAtom);
  const hasRequest = useRef(false);

  useEffect(() => {
    if (hasRequest.current) return;
    const fetchAnalysis = async () => {
      try {
        hasRequest.current = true;
        const response = await axios.post("http://127.0.0.1:8000/analyze", {
          id: searchParams.get("id") as string,
          salary_min: Number(searchParams.get("salary_min")),
          salary_max: Number(searchParams.get("salary_max")),
          holiday: Number(searchParams.get("holiday")),
          description: searchParams.get("description") as string,
        });
        setResult(response.data);
        router.push("/analyze/result");
      } catch (error) {
        console.error("エラーが発生しました", error);
        hasRequest.current = false;
        // router.push("/");
        // router.push("/analyze/error");
      }
    };
    fetchAnalysis();
  }, [searchParams, router, setResult]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-pulse text-lg">AIが求人を分析中です…🤖💭</div>
    </div>
  );
};

export default AnalyzingPage;
