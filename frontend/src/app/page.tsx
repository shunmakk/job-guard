"use client";
import MainCard from "@/components/basic/Card";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { userDataAtom } from "@/stores/userAtom";

export default function Home() {
  //このページはLPとして使いたい、今後別のページを作成する
  const { user } = useUser();
  const [userData] = useAtom(userDataAtom);

  // ログインしているけど設定未完了の場合の案内
  const showPreferencesMessage =
    user && userData && !userData.has_completed_preferences;

  return (
    <>
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-3/4 md:w-1/2">
        <div className="my-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">job Guard</h1>
          <p className="text-center text-sm md:text-base mt-5">
            あなたが応募しようとしている求人との相性、<br></br>
            ブラック企業の可能性が無いかAIが診断！
          </p>
          {showPreferencesMessage && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-10 py-3 rounded mt-6 max-w-[500px] w-full">
              <p className="text-center">
                労働価値観・希望条件の設定が未完了です。
              </p>
              <div className="text-center">
                <a
                  href="/preferences"
                  className="underline font-semibold text-center"
                >
                  設定を完了する
                </a>
              </div>
            </div>
          )}
          <div className="w-full mt-10">
            <MainCard
              title="自分で入力項目して診断してみる"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius facilis in molestiae quod! Aut doloribus est illum iure porro sunt. Eius illo iusto maxime nihil possimus quae tempora voluptas voluptates. ＜精度高＞"
              href="/analyze"
              buttonText="Start!"
              className="mb-12 max-w-[500px]"
            />
            <MainCard
              title="求人サイトのURLを入力して診断してみる"
              description="Comming Soon! ＜お手軽＞"
              href="/url-input"
              buttonText="Start!"
              className="max-w-[500px]"
            />
          </div>
        </div>
      </main>
    </>
  );
}
