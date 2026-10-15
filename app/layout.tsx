import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${grotesk.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
