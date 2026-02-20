"use server";

import { auth } from "@clerk/nextjs/server";
import { AnalysisResult } from "@/stores/analysisResultAtom";

export async function analyzeCompany(formData: {
  industry: string;
  job_text: string;
}): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("認証されていないため分析を中断します");
      return { success: false, error: "認証されていません" };
    }

    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}) as Record<string,unknown>);
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}を返却しました。`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("分析エラー:", error);
    return { success: false, error: error instanceof Error ? error.message : "分析中にエラーが発生しました" };
  }
}
