import Image from "next/image";
import MainCard from "@/components/basic/Card";

export default function Home() {
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
