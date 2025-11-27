import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/_navigation/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SideBar } from "@/app/_navigation/sidebar/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryProvider } from "@/app/_providers/react-query/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Road Next",
  description: "My Road to Next application...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ReactQueryProvider>
          <Header />
          <main
            className="
                flex-1
                py-24 px-8
                bg-secondary/20
                flex flex-col
                items-center
              "
          >
            <NuqsAdapter>
              <SidebarProvider>
                <SideBar />
                {children}
              </SidebarProvider>
            </NuqsAdapter>
          </main>
          <Toaster expand />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
