import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"> */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-3/4 md:w-1/2">
        <h1 className="text-4xl font-bold mt-12">job Guard</h1>
        <p className="text-center text-sm md:text-base">
          あなたが応募しようとしている企業は大丈夫？？<br></br>
          ブラ⚪️ク企業の可能性がないかAIが診断！！！
        </p>
        <div className="w-full mt-10">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>
                <Link href="/analyze">
                  <h2>自分で入力項目して診断してみる</h2>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pointer-events-none">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                facilis in molestiae quod! Aut doloribus est illum iure porro
                sunt. Eius illo iusto maxime nihil possimus quae tempora
                voluptas voluptates. ＜精度高＞
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <nav>
                <Link href="/analyze" className="text-xl text-blue-500">
                  Start!
                </Link>
              </nav>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Link href="/url-input">
                  <h2> 求人サイトのURLを入力して診断してみる</h2>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pointer-events-none">
              <p>Comming Soon! ＜お手軽＞</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              {/* <nav>
                <Link href="/url-input" className="text-xl text-blue-500">
                  Start!
                </Link>
              </nav> */}
            </CardFooter>
          </Card>
        </div>
      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
      {/* </div> */}
    </>
  );
}
