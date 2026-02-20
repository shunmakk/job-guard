"use client";
import { useAtomValue } from "jotai";
import { analysisResultAtom } from "@/stores/analysisResultAtom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getRiskScoreColor from "@/utils/getRiskScoreColor";
import getMatchingScoreColor from "@/utils/getMatchingScoreColor";



export default function ResultPage() {
  const result = useAtomValue(analysisResultAtom);
  const router = useRouter();

  if (!result) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-1/2 w-full bg-white rounded-2xl shadow flex flex-col items-center justify-center md:p-12 p-8">
        <div className="flex flex-col items-center justify-center">
          <p>診断結果の取得に失敗しました。</p>
          <button
            onClick={() => router.push("/analyze")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            再診断する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">診断結果</h2>

        {/* マッチング度 */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold mb-3">マッチング度</h3>
          <p className={`text-4xl font-bold ${getMatchingScoreColor(result.matching_score)}`}>
            {result.matching_score}
            <span className="text-lg text-gray-500">/100</span>
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium mb-2">AIのコメント</p>
            <div className="relative">
              <span className="absolute -top-2.5 left-3 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-gray-300"></span>
              <p className="text-gray-700 whitespace-pre-wrap border border-gray-300 bg-white p-3 rounded-md text-sm">
                {result.matching_reason}
              </p>
            </div>
          </div>
        </div>

        {/* ブラック企業リスク */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold mb-3">ブラック企業リスク</h3>
          <p className={`text-4xl font-bold ${getRiskScoreColor(result.black_risk_score)}`}>
            {result.black_risk_score}
            <span className="text-lg text-gray-500">/100</span>
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium mb-2">AIのコメント</p>
            <div className="relative">
              <span className="absolute -top-2.5 left-3 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-gray-300"></span>
              <p className="text-gray-700 whitespace-pre-wrap border border-gray-300 bg-white p-3 rounded-md text-sm">
                {result.black_risk_reason}
              </p>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/analyze")}
            className="bg-blue-500 text-white px-6 py-2 rounded cursor-pointer"
          >
            もう一度分析する
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="px-6 py-2 rounded cursor-pointer"
          >
            トップに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
