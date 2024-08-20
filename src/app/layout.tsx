import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoT Socket App",
  description: "An app for LoT web socket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ch-CN">
      <body>{children}</body>
    </html>
  );
}
