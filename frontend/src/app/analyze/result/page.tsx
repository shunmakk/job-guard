"use client";
import { useAtomValue } from "jotai";
import { analysisResultAtom } from "@/lib/atom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  const result = useAtomValue(analysisResultAtom);
  const router = useRouter();

  if (!result) {
    return (
      <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 sm:w-1/2 h-1/2 w-full bg-white rounded-2xl shadow flex flex-col items-center justify-center md:p-12 p-8">
        <div className="flex flex-col items-center justify-center">
          <p>診断結果が見つかりません。</p>
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
    <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 sm:w-1/2 h-1/2 w-full bg-white rounded-2xl shadow flex flex-col items-center justify-center p-12">
      <h2 className="text-xl font-bold mb-4">診断結果</h2>
      <p className="text-3xl font-bold text-center pb-10">
        危険度：{result.score}/5
      </p>
      <div className="flex flex-col">
        <p className="text-lg font-bold mb-2">🤖AIのコメント</p>
        <div className="relative">
          <span className="absolute -top-2.5 left-1 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] border-l-transparent border-r-transparent border-b-gray-400 "></span>
          <p className="text-gray-700 whitespace-pre-wrap border border-gray-400 p-2 rounded-md">
            {result.reason}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-4 md:mt-20 mt-5">
        <Button
          onClick={() => router.push("/analyze")}
          className=" bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          もう一度分析する
        </Button>
        <Button
          onClick={() => router.push("/")}
          className=" bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          トップに戻る
        </Button>
      </div>
    </div>
  );
}
