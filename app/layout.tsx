import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "900"],
});

export const metadata: Metadata = {
  title: "Vogue Admin",
  description: "Generated by Vogue Admin app",
};

export const fetchCache = "default-cache"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
