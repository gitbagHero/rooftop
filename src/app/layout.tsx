import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gitbagHero",
  description: "gitbagHero 的个人主页、项目展示与 Rooftop 笔记入口。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
