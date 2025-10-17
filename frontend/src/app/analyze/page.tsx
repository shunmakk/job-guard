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
    .min(0, { message: "休暇は0日以上" })
    .max(365, { message: "休暇は365日以下" }),
  description: z
    .string()
    .min(1, { message: "説明は1文字以上" })
    .max(1000, { message: "説明は1000文字以下" }),
});

const InputPage = () => {
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

    //ログで出力
    console.log(data);
  };

  return (
    <>
      <div>
        <h1>ブラック企業度診断</h1>
        <p>以下の4項目を入力して診断してみよう！</p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3>給与の幅</h3>
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最低年収（万円</FormLabel>
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
              <FormField
                control={form.control}
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最高年収（万円</FormLabel>
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
            <div>
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
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      求人の説明をコピペして入力してください
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="求人情報" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={!isValid || Object.keys(errors).length > 0}
            >
              診断する
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default InputPage;
