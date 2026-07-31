import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahil Panwar — Full Stack Developer",
  description:
    "Full Stack Developer specializing in building premium digital experiences. Expert in ReactJS, NextJS, TypeScript, and modern web technologies.",
  keywords: [
    "Full Stack Developer",
    "ReactJS",
    "NextJS",
    "TypeScript",
    "Web Developer",
    "Pawan Sah",
  ],
  authors: [{ name: "Pawan Sah" }],
  openGraph: {
    title: "Sahil Panwar — Full Stack Developer",
    description: "Turning your ideas into Digital Experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-white">
        {children}
      </body>
    </html>
  );
}
