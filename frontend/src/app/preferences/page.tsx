"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { userDataAtom, isRegisteringAtom } from "@/stores/userAtom";
import { registerUser } from "../actions/registerUser";
import Loading from "@/components/basic/loading";

export default function Preferences() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useAtom(userDataAtom);
  const [isRegistering, setIsRegistering] = useAtom(isRegisteringAtom);
  const calledRef = useRef(false);

  useEffect(() => {
    // 既にユーザーデータがある場合はスキップ
    if (userData) {
      console.log("既にユーザーデータ存在しています");
      return;
    }

    //新規ユーザー登録処理
    const registerNewUser = async () => {
      if (!isLoaded || !user) {
        return;
      }
      //重複防止
      if (calledRef.current || isRegistering) {
        return;
      }

      calledRef.current = true;
      setIsRegistering(true);

      try {
        const data = await registerUser();
        //userDataを更新します
        setUserData({
          email: data.email,
          provider: data.provider,
          has_completed_preferences: data.has_completed_preferences,
          isLoaded: true,
        });

        console.log("新規ユーザー登録完了:", data);
      } catch (error) {
        console.error("ユーザー登録エラーが発生しました:", error);
      } finally {
        setIsRegistering(false);
      }
    };
    registerNewUser();
  }, [isLoaded, user, userData, isRegistering, setUserData, setIsRegistering]);

  const handleComplete = () => {
    if (userData) {
      // has_completed_preferencesを更新する処理と、フォームの情報を保存する処理をここに追加
      router.push("/");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">労働価値観・希望条件の設定</h1>
      <p className="mb-6">
        job Guardへようこそ！まずは理想の働き方の登録をしてください。
      </p>

      {isRegistering ? (
        <Loading message="ユーザー登録中..." />
      ) : (
        <div>
          {/* 今後ここに設定フォームを追加 */}
          <Button onClick={handleComplete}>設定完了</Button>
        </div>
      )}
    </div>
  );
}
