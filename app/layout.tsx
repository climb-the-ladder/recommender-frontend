import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClimbTheLadder - Carrer Path AI tool",
  description: "We help students find their calling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && (
          <script async src="https://cdn.seline.so/seline.js"></script>
        )}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <Providers>
        <body
          className={cn(
            inter.variable,
            caveat.variable,
            "dark font-sans antialiased"
          )}
        >
          <main>{children}</main>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
