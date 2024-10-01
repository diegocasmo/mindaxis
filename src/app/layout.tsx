import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";

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
  title: "MindAxis",
  description: "Turn goals into actionable roadmaps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
