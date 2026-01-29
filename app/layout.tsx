import type { Metadata } from "next";
import { Inter, Manrope, Noto_Sans } from "next/font/google"; 
import "./globals.css";

import Providers from "@/lib/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

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
    <html lang="es" className={`${inter.variable} ${manrope.variable} ${notoSans.variable} mdl-js dark`}>
      <body className={inter.className}>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
