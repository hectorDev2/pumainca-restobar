import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or standard font import in next/font
import "./globals.css";

import Providers from "@/lib/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pumainca Restobar - Sabores Auténticos",
  description: "Experiencia gastronómica inolvidable con sabores auténticos de los Andes fusionados con técnicas modernas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="mdl-js dark">
      <body className={inter.className}>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Noto+Sans:wght@300..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
