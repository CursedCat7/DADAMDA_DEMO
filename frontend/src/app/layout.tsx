import type { Metadata } from "next";
import { BottomNav } from "@/components/organisms/BottomNav";
import { Providers } from "@/lib/providers";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "다담다",
  description: "오늘의 남은 가치, 다담다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="mx-auto flex min-h-full max-w-[430px] flex-col">
        <Providers>
          <main className="flex-1 pb-4">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
