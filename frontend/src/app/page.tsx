"use client";
import MainCard from "@/components/basic/Card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { registerUser } from "./actions/registerUser";
import { useAtom } from "jotai";
import { userDataAtom, isRegisteringAtom } from "@/stores/userAtom";

export default function Home() {
  //このページはLPとして使いたい、今後別のページを作成する
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const calledRef = useRef(false);
  const [userData, setUserData] = useAtom(userDataAtom);
  const [isRegistering, setIsRegistering] = useAtom(isRegisteringAtom);

  useEffect(() => {
    if (userData) {
      console.log("すでにUserDataが存在しています");
      return;
    }

    // userDataがnullの場合のみAPI呼び出し
    const fetchUserData = async () => {
      if (!isLoaded || !user) {
        return;
      }
      if (calledRef.current || isRegistering) {
        return;
      }

      console.log("API呼び出しを開始します");
      calledRef.current = true;
      setIsRegistering(true);

      try {
        const data = await registerUser();
        setUserData({
          email: data.email,
          provider: data.provider,
          has_completed_preferences: data.has_completed_preferences,
          isLoaded: true,
        });
        if (!data.has_completed_preferences) {
          router.push("/preferences");
        } else {
          router.push("/analyze");
        }
      } catch (error) {
        console.error("ユーザー登録エラー:", error);
      } finally {
        setIsRegistering(false);
      }
    };

    fetchUserData();
  }, [isLoaded]);

  return (
    <>
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-3/4 md:w-1/2">
        <div className="my-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">job Guard</h1>
          <p className="text-center text-sm md:text-base mt-5">
            あなたが応募しようとしている企業は大丈夫？？<br></br>
            ブラ⚪️ク企業の可能性がないかAIが診断！！！
          </p>
          <div className="w-full mt-10">
            <MainCard
              title="自分で入力項目して診断してみる"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius facilis in molestiae quod! Aut doloribus est illum iure porro sunt. Eius illo iusto maxime nihil possimus quae tempora voluptas voluptates. ＜精度高＞"
              href="/analyze"
              buttonText="Start!"
              className="mb-12"
            />
            <MainCard
              title="求人サイトのURLを入力して診断してみる"
              description="Comming Soon! ＜お手軽＞"
              href="/url-input"
              buttonText="Start!"
            />
          </div>
        </div>
      </main>
    </>
  );
}
