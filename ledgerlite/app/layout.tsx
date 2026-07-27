import type { Metadata } from "next";
import "./globals.css";
import Logout from "@/components/logout";

export const metadata: Metadata = {
  title: "LedgerLite",
  description: "Record sales, track expenses, manage inventory and stay on top of your business with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
