// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/app/ui/toast";
import Toast from "@/app/ui/toast";
import "./globals.css"; // create a simple CSS file if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMS Portal",
  description: "Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={inter.style}
        style={{ margin: 0, background: "#0a0a0a", color: "#c8c0b0" }}
      >
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
