import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BurnBox",
  description: "BurnBox - Next.js on Azure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
