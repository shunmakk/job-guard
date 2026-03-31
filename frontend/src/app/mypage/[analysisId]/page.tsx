"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchJobHistoryDetail,
  type JobHistoryDetail,
} from "@/app/actions/fetchMyPageHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader,  } from "@/components/ui/card";
import getMatchingScoreColor from "@/utils/getMatchingScoreColor";
import getRiskScoreColor from "@/utils/getRiskScoreColor";
import { formatDate } from "@/utils/formatDate";
import { DetailSkeleton } from "@/components/layout/Skeleton";





const DetailContent = ({ detail }: { detail: JobHistoryDetail }) => (
  <Card className="w-full">
    <CardHeader className="space-y-2">
      <p className="text- text-muted-foreground">業界: {detail.industry}</p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-6 text-sm font-semibold">
        <p className={getMatchingScoreColor(detail.matching_score)}>
          マッチ度: {detail.matching_score}
        </p>
        <p className={getRiskScoreColor(detail.black_risk_score)}>
          ブラック度: {detail.black_risk_score}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">診断日: {formatDate(detail.created_at)}</p>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">マッチング理由</h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md border p-3">
          {detail.matching_reason}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">ブラックリスク理由</h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md border p-3">
          {detail.black_risk_reason}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">求人本文</h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap rounded-md border p-3">
          {detail.job_text}
        </p>
      </section>
    </CardContent>
  </Card>
);

export default function MyPageDetail() {
  const params = useParams<{ analysisId: string }>();
  const analysisId = params.analysisId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["job-mypage-detail", analysisId],
    queryFn: () => fetchJobHistoryDetail(analysisId),
    enabled: Boolean(analysisId),
    retry: false,
  });

  return (
    <main className="container mx-auto w-11/12 max-w-3xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold w-10/12">{data?.job_post_title}の求人診断結果詳細</h1>
        <Button asChild variant="outline">
          <Link href="/mypage">履歴一覧へ戻る</Link>
        </Button>
      </div>

      {isLoading && <DetailSkeleton />}

      {!isLoading && error && (
        <Card>
          <CardContent className="py-8 text-center space-y-2">
            <p className="font-semibold">履歴詳細の取得に失敗しました</p>
            <p className="text-sm text-muted-foreground">時間を置いて再読み込みしてください</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data && <DetailContent detail={data} />}
    </main>
  );
}
