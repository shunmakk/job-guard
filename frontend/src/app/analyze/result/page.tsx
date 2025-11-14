"use client";
import { useAtomValue } from "jotai";
import { analysisResultAtom } from "@/lib/atom";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const result = useAtomValue(analysisResultAtom);
  const router = useRouter();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>診断結果が見つかりません。</p>
        <button
          onClick={() => router.push("/analyze")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          再診断する
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">診断結果</h2>
      <p className="text-3xl font-bold text-center mb-2">
        危険度：{result.score}/5
      </p>
      <p className="text-gray-700 whitespace-pre-wrap">{result.reason}</p>
      <button
        onClick={() => router.push("/analyze")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        診断をやり直す
      </button>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        トップに戻る
      </button>
    </div>
  );
}
