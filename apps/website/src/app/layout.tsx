import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
// import { Header } from '@/components/header'
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fundify - Decentralized Project Funding Platform",
  description:
    "Fund your projects with cryptocurrency on our decentralized funding platform. Connect with investors and bring your ideas to life.",
  keywords:
    "funding, cryptocurrency, ethereum, projects, decentralized, blockchain",
  authors: [
    {
      name: "Kartik Turak",
    },
    {
      name: "Arav Bhivgade",
    },
    {
      name: "Pavan Rathod",
    },
    {
      name: "Piyush Churhe",
    },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* <Header /> */}
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
