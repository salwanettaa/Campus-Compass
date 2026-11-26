import type { Metadata } from "next";
import { Tiro_Kannada, Wix_Madefor_Display } from "next/font/google";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const wix = Wix_Madefor_Display({
  variable: "--font-wix",
  subsets: ["latin"],
  display: "swap",
});

/** Italic serif for the one emphasised word in large headlines. */
const tiro = Tiro_Kannada({
  variable: "--font-tiro",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "Campus Compass",
    template: "%s | Campus Compass",
  },
  description:
    "Student adaptation and community knowledge platform: ask, learn from seniors, and get guidance with sources.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${wix.variable} ${tiro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
