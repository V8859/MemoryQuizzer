import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Memory Quizzer | MQ",
  description: "Memorize information using advanced techniques",
  openGraph: {
    title: "Memory Quizzer | MQ",
    description: "Challenge yourself with engaging quizzes.",
    type: "website",
    url: "https://memory-quizzer.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Head>
          <link rel="icon" type="image/png" href="/icon.png" />
        </Head>
        {children}
      </body>
    </html>
  );
}
