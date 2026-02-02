"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { userDataAtom, isRegisteringAtom } from "@/stores/userAtom";
import { registerUser } from "../actions/registerUser";
import Loading from "@/components/basic/loading";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useForm, Controller } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { savePreferences } from "../actions/savePreferences";


const formSchema = z.object({
  desired_salary: z.number().min(200).max(3000),
  age: z.string().min(1, { message: "年齢を選択してください" }),
  desired_holiday: z.number().min(110).max(150),
  max_overtime_hours: z.number().min(0).max(80),
  remote_preference: z.string().min(1, { message: "在宅可否を選択してください" }),
  work_style: z.string().min(1, { message: "働き方を入力してください" }).max(1000,{message: "働き方は1000文字以下の入力にしてください"}),
});

export default function Preferences() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useAtom(userDataAtom);
  const [isRegistering, setIsRegistering] = useAtom(isRegisteringAtom);
  const calledRef = useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      desired_salary: 500,
      age: "",
      desired_holiday: 120,
      max_overtime_hours: 20,
      remote_preference: "",
      work_style: "",
    },
  });

  const { isDirty, isValid } = form.formState;
  useNavigationGuard(isDirty);

  useEffect(() => {
    if (userData) {
      console.log("既にユーザーデータ存在しています");
      return;
    }

    const registerNewUser = async () => {
      if (!isLoaded || !user) {
        return;
      }
      if (calledRef.current || isRegistering) {
        return;
      }

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

        console.log("新規ユーザー登録完了:", data);
      } catch (error) {
        console.error("ユーザー登録エラーが発生しました:", error);
      } finally {
        setIsRegistering(false);
      }
    };
    registerNewUser();
  }, [isLoaded, user, userData, isRegistering, setUserData, setIsRegistering]);

  const handleComplete = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      form.reset(data, { keepValues: true });
      //フォームの情報を保存
      const result = await savePreferences(data)

      if(userData){
        setUserData({
          ...userData,
          has_completed_preferences: true,
        });
        console.log("希望条件設定完了:", userData);
      }
      //リダイレクト
      router.replace("/")
    } catch (error) {
      console.error("設定完了エラーが発生しました:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">労働価値観・希望条件の設定</h1>
      <p className="mb-6">
        job Guardへようこそ！まずは理想の働き方の登録をしてください。
        <br />
        これは、AIが分析する際に必要な情報です。全ての項目に対応しているか確認してからボタンを押してください。
      </p>

      {isRegistering ? (
        <Loading message="ユーザー登録中..." />
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleComplete)}>
              {/* 希望年収のスライダー */}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">希望年収</label>
                <Controller
                  control={form.control}
                  name="desired_salary"
                  render={({ field }) => (
                    <div>
                      <Slider
                        min={200}
                        max={3000}
                        step={50}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <p className="text-lg text-gray-600 mt-1">現在: {field.value}万円を選択しています</p>
                      <p className="text-sm text-gray-600 mt-1">
                        ※ 今のスキル感や市場感を踏まえて「現実的にほしいライン」を選んでください。
                        <br />
                        ※ 将来の理想年収ではなく、「転職するとしたらこれくらいはほしい」という金額を目安にしてください。
                      </p>
                    </div>
                  )}
                />
              </div>
              {/* 年齢のセレクトボックス */}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">年齢</label>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field, fieldState }) => (
                    <div>
                      <NativeSelect {...field} className="w-full" onChange={(e) => field.onChange(e.target.value)}>
                        <NativeSelectOption value="">選択してください</NativeSelectOption>
                        <NativeSelectOption value="20歳未満">20歳未満</NativeSelectOption>
                        <NativeSelectOption value="20~29歳">20~29歳</NativeSelectOption>
                        <NativeSelectOption value="30~39歳">30~39歳</NativeSelectOption>
                        <NativeSelectOption value="40~49歳">40~49歳</NativeSelectOption>
                        <NativeSelectOption value="50~59歳">50~59歳</NativeSelectOption>
                        <NativeSelectOption value="60歳以上">60歳以上</NativeSelectOption>
                      </NativeSelect>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* 希望休日のスライダー */}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">希望休日</label>
                <Controller
                  control={form.control}
                  name="desired_holiday"
                  render={({ field }) => (
                    <>
                      <Slider
                        min={110}
                        max={150}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <p className="text-lg text-gray-600 mt-1">現在: {field.value}日以上を選択しています</p>
                      <p className="text-sm text-gray-600 mt-1">※「これを下回るとキツい」と感じる年間休日数を選んでください。<br/>※一般的には120日以上で「土日祝＋α」レベルです。</p>
                    </>
                  )}
                />
              </div>

              {/* 許容残業時間 */}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">許容残業時間(月)</label>
                <Controller
                  control={form.control}
                  name="max_overtime_hours"
                  render={({ field }) => (
                    <>
                      <Slider
                        min={0}
                        max={80}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <p className="text-lg text-gray-600 mt-1">現在の許容残業時間: {field.value}時間／月まで</p>
                    </>
                  )}
                />
              </div>

              {/* 在宅可否のセレクトボックス */}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">在宅可否</label>
                <FormField
                  control={form.control}
                  name="remote_preference"
                  render={({ field, fieldState }) => (
                    <>
                      <NativeSelect {...field} className="w-full">
                        <NativeSelectOption value="">選択してください</NativeSelectOption>
                        <NativeSelectOption value="必須">必須</NativeSelectOption>
                        <NativeSelectOption value="あった方がよい">あった方がよい</NativeSelectOption>
                        <NativeSelectOption value="どちらでもよい">どちらでもよい</NativeSelectOption>
                        <NativeSelectOption value="出社メインOK">出社メインOK</NativeSelectOption>
                      </NativeSelect>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* 働き方のテキストエリア*/}
              <div className="mb-[30px]">
                <label className="block text-lg font-medium mb-2">働き方</label>
                <FormField
                  control={form.control}
                  name="work_style"
                  render={({ field, fieldState }) => (
                    <>
                      <Textarea
                        {...field}
                        placeholder="自分のペースでコツコツ、残業少なめで長く続けられる環境がよい"
                        className="w-full h-50"
                        rows={20}
                        maxLength={1000}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                      )}
                       <p className="text-sm text-gray-600 mt-1">※ あなたが「こういう環境で働けたらいいな」と思うイメージを、ざっくりでいいので書いてください。
                        <br />・どんなチーム雰囲気が好きか<br />・どれくらい成長を求めたいか<br />・働く上で絶対に譲れないことなど <br />を書いてもらえると、AIがあなたに合う／合わない求人を判断しやすくなります。</p>
                    </>
                  )}
                />
              </div>
              <div className="flex justify-center mb-8">
                 {isValid && Object.keys(form.formState.errors).length === 0 && (
                <Button type="submit" aria-label="設定完了" className="px-20 py-8 rounded-full">
                  設定完了
                </Button>
              )}
              {(!isValid || Object.keys(form.formState.errors).length > 0) && (
                <Button type="submit" aria-label="設定完了" disabled className="px-10 py-8 rounded-full">
              全ての項目に対応しているか、エラーがないか確認してください
                </Button>
              )}
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}