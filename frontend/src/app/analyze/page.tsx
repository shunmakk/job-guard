"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  salary_min: z.coerce
    .number<number>()
    .min(100, { message: "最低提示給料は100万以上" })
    .max(3000, { message: "最低提示給料は3000万以下" }),
  salary_max: z.coerce
    .number<number>()
    .min(200, { message: "最高提示給料は200万以上" })
    .max(9999, { message: "最高提示給料は9999万以下" }),
  holidays: z.coerce
    .number<number>()
    .min(1, { message: "休暇は1日以上" })
    .max(365, { message: "休暇は365日以下" }),
  description: z
    .string()
    .min(1, { message: "説明は1文字以上" })
    .max(9999, { message: "説明は9999文字以下" }),
});

const InputPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // リアルタイムでバリデーションを実行できるようにする
    defaultValues: {
      salary_min: 100,
      salary_max: 300,
      holidays: 120,
      description: "",
    },
  });

  // フォームのバリデーション状態を取得
  const { isValid, errors } = form.formState;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    //ここでid生成
    const generateUUID = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (character) {
          const randomValue = (Math.random() * 16) | 0;

          let generatedCharacter;
          if (character === "x") {
            generatedCharacter = randomValue;
          } else {
            generatedCharacter = (randomValue & 0x3) | 0x8;
          }

          return generatedCharacter.toString(16);
        }
      );
    };
    const id = generateUUID();
    //ログで出力
    console.log(id, "クライアント側で生成したuuid,string型");
    console.log(data, "サーバーサイド側に送るオブジェクト");
    console.log(data.description, "求人の説明");
    console.log(data.salary_max, "最高年収");
    console.log(data.salary_min, "最低年収");
    console.log(data.holidays, "年間休日数");
    console.log(isValid, "バリデーションのisValid");

    router.push(
      `/analyze/analyzing?id=${id}&salary_min=${data.salary_min}&salary_max=${
        data.salary_max
      }&holiday=${data.holidays}&description=${encodeURIComponent(
        data.description
      )}`
    );
  };

  return (
    <div className="container mx-auto w-4/5 sm:w-1/2">
      <div className="space-y-2 my-8">
        <h1 className="text-center text-2xl font-bold">ブラック企業度診断</h1>
        <p className="text-center text-sm text-muted-foreground mt-5">
          以下の4項目を入力してブラック企業度を診断してみよう！
        </p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-full min-w-full">
              <h3 className="text-lg font-bold mb-2">給与の幅</h3>
              <div className="flex flex-row gap-4 items-start justify-center">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="salary_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最低年収（万円）</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="提示年収下限"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="salary_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最高年収（万円）</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="提示年収上限"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-full min-w-full">
              <h3 className="text-lg font-bold mb-2">年間休日数</h3>
              <FormField
                control={form.control}
                name="holidays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>年間休日数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="年間休日数"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full min-w-full">
              <h3 className="text-lg font-bold mb-2">求人の説明</h3>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>求人の説明をコピペしてきてください</FormLabel>
                    <FormControl className="w-full min-w-full">
                      <Textarea
                        placeholder="求人情報"
                        {...field}
                        className="resize-none h-60 w-full min-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground text-sm pl-3">
                      Indeedやリクナビの本文を貼ってください
                    </p>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center mt-18">
              <Button
                className="sm:w-1/2 py-8 w-3/4 cursor-pointer"
                type="submit"
                disabled={!isValid || Object.keys(errors).length > 0}
              >
                診断する
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InputPage;
