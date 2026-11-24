import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
