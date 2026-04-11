"use server";

import { auth } from "@clerk/nextjs/server";
import { apiUrl } from "@/lib/apiUrl";

export type JobHistoryItem = {
  analysis_id: string;
  job_post_id: string;
  job_post_title: string;
  industry: string;
  matching_score: number;
  black_risk_score: number;
  matching_reason: string;
  created_at: string;
};

export type JobHistoryDetail = JobHistoryItem & {
  black_risk_reason: string;
  job_text: string;
};

export async function fetchJobHistory(): Promise<JobHistoryItem[]> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("認証されていません");
  }

  const response = await fetch(apiUrl("/job-analysis/mypage"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}) as Record<string, unknown>);
    throw new Error(
      typeof errorData.detail === "string"
        ? errorData.detail
        : `履歴取得に失敗しました (status: ${response.status})`,
    );
  }

  return (await response.json()) as JobHistoryItem[];
}

export async function fetchJobHistoryDetail(
  analysisId: string,
): Promise<JobHistoryDetail> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("認証されていません");
  }

  const response = await fetch(apiUrl(`/job-analysis/mypage/${analysisId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}) as Record<string, unknown>);
    throw new Error(
      typeof errorData.detail === "string"
        ? errorData.detail
        : `履歴詳細の取得に失敗しました (status: ${response.status})`,
    );
  }

  return (await response.json()) as JobHistoryDetail;
}
