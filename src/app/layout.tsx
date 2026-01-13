import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transformation Hub",
  description: "A daily, guided self-transformation journey that turns timeless human wisdom into small, repeatable actions that reshape identity over time.",
  keywords: ["self-improvement", "personal growth", "stoicism", "habits", "mindfulness"],
  authors: [{ name: "Transformation Hub" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Transformation Hub",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
