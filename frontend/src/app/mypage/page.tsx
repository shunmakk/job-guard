"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJobHistory, type JobHistoryItem } from "@/app/actions/fetchMyPageHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistorySkeleton } from "@/components/layout/Skeleton";
import getMatchingScoreColor from "@/utils/getMatchingScoreColor";
import getRiskScoreColor from "@/utils/getRiskScoreColor";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";



const truncateReason = (text: string, length = 80) =>
  text.length > length ? `${text.slice(0, length)}...` : text;

const HistoryCard = ({ history }: { history: JobHistoryItem }) => (
  <Link href={`/mypage/${history.analysis_id}`} className="block">
    <Card className="w-full transition-colors hover:bg-accent/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">{history.job_post_title}</CardTitle>
        <p className="text-sm text-muted-foreground">業界: {history.industry}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-6 text-sm font-semibold">
          <p className={getMatchingScoreColor(history.matching_score)}>
            マッチ度: {history.matching_score}
          </p>
          <p className={getRiskScoreColor(history.black_risk_score)}>
            ブラック度: {history.black_risk_score}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">診断日: {formatDate(history.created_at)}</p>
        <p className="text-sm leading-relaxed">{truncateReason(history.matching_reason)}</p>
        <p className="text-sm text-blue-600">詳細を見る</p>
      </CardContent>
    </Card>
  </Link>
);

export default function MyPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["job-mypage"],
    queryFn: fetchJobHistory,
    retry: false,
  });

  return (
    <main className="container mx-auto w-11/12 max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">診断履歴</h1>

      {isLoading && (
        <div className="space-y-4">
          <HistorySkeleton />
          <HistorySkeleton />
          <HistorySkeleton />
        </div>
      )}

      {!isLoading && error && (
        <Card>
          <CardContent className="py-8 text-center space-y-2">
            <p className="font-semibold">履歴の取得に失敗しました</p>
            <p className="text-sm text-muted-foreground">再読み込みしてください</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <div className="space-y-1">
              <p className="font-semibold">まだ診断履歴がありません</p>
              <p className="text-sm text-muted-foreground">
                求人を入力して診断をしてみましょう
              </p>
            </div>
            <Button asChild>
              <Link href="/analyze">診断する</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((history) => (
            <HistoryCard key={history.analysis_id} history={history} />
          ))}
        </div>
      )}
    </main>
  );
}
