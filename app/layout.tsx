import type { Metadata } from "next";
import { Inter, Manrope, Noto_Sans } from "next/font/google";
import "./globals.css";

import Providers from "@/lib/Providers";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";
import PWARegister from "@/components/PWARegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Pumainca Restobar - Sabores Auténticos",
  description:
    "Experiencia gastronómica inolvidable con sabores auténticos de los Andes fusionados con técnicas modernas.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pumainca",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Pumainca Restobar",
    title: "Pumainca Restobar - Sabores Auténticos",
    description:
      "Experiencia gastronómica inolvidable con sabores auténticos de los Andes fusionados con técnicas modernas.",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pumainca Restobar - Sabores Auténticos",
    description:
      "Experiencia gastronómica inolvidable con sabores auténticos de los Andes fusionados con técnicas modernas.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#d4af37" },
  ],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} ${notoSans.variable} mdl-js dark`}
    >
      <body className={inter.className}>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Providers>{children}</Providers>
        <PWARegister />
        <InstallPWAPrompt />
      </body>
    </html>
  );
}
