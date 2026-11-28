import type { Metadata, Viewport } from "next";
import { Wix_Madefor_Display } from "next/font/google";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const wix = Wix_Madefor_Display({
  variable: "--font-wix",
  subsets: ["latin"],
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

export const viewport: Viewport = {
  // "cover" is what makes the safe-area insets work on notched phones.
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${wix.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
