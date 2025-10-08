import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "job Guard",
    template: "%s | job Guard",
  },
  description:
    "ブラック企業検知サービス、項目を入力するだけであなたはその企業を受けるべきかを教えてくれます。",
  keywords: ["転職", "企業分析", "ブラック企業", "労働条件", "口コミ分析"],
  authors: [{ name: "job Guard Team" }],
  openGraph: {
    title: "job Guard",
    description: "ブラック企業検知サービス",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "job Guard",
    description: "ブラック企業検知サービス",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-screen-md mx-auto font-sans flex flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
