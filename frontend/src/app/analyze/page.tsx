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
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { inputInfoAtom } from "@/stores/inputInfoAtom";

// 業界リスト
const INDUSTRIES = [
  "IT・通信",
  "金融・保険",
  "メーカー・製造",
  "商社",
  "小売・流通",
  "サービス・外食",
  "マスコミ・広告",
  "コンサルティング",
  "不動産・建設",
  "医療・福祉",
  "教育",
  "官公庁・公社・団体",
  "その他",
] as const satisfies readonly string[];

const formSchema = z.object({
  industry: z.string().min(1, { message: "業界を選択してください" }),
  job_text: z
    .string()
    .min(50, { message: "求人情報は50文字以上入力してください" })
    .max(10000, { message: "求人情報は10000文字以下にしてください" }),
});

const InputPage = () => {
  const router = useRouter();

  const setInputInfo = useSetAtom(inputInfoAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      industry: "",
      job_text: "",
    },
  });

  const { isValid, errors } = form.formState;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setInputInfo({
      industry: data.industry,
      job_text: data.job_text,
    });

    router.push("/analyze/analyzing");
  };

  return (
    <div className="container mx-auto w-4/5 sm:w-1/2">
      <div className="my-12 flex flex-col items-center justify-center">
        <div className="space-y-2 mb-8">
          <h1 className="text-center text-2xl font-bold">求人分析</h1>
          <p className="text-center text-sm text-muted-foreground mt-5">
            業界と求人情報を入力して、マッチング度とブラック企業リスクを診断しよう！
          </p>
        </div>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="w-full">
                <h3 className="text-lg font-bold mb-2">業界</h3>
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>業界を選択してください</FormLabel>
                      <FormControl>
                        <NativeSelect
                          className="w-full"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <NativeSelectOption value="" disabled>
                            業界を選択
                          </NativeSelectOption>
                          {INDUSTRIES.map((industry) => (
                            <NativeSelectOption key={industry} value={industry}>
                              {industry}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <h3 className="text-lg font-bold mb-2">求人情報</h3>
                <FormField
                  control={form.control}
                  name="job_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>求人情報をコピペしてください</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="求人情報（給与、休日、仕事内容など）を貼り付けてください"
                          {...field}
                          className="resize-none h-80 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-muted-foreground text-sm pl-3">
                        Indeedやリクナビなどの求人本文をそのまま貼ってください（50文字以上）
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
    </div>
  );
};

export default InputPage;
