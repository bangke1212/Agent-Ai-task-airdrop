import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Airdrop Agent - Automated Airdrop Console",
  description: "AI-powered airdrop automation agent for managing and executing airdrop tasks across multiple chains and wallets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#e4e4e7",
              border: "1px solid #27272a",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
