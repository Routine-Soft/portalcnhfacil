import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal CNH Fácil",
  description: "Cursos e Treinamentos",

  openGraph: {
    title: "Portal CNH Fácil",
    description: "Cursos e Treinamentos",
    url: "https://www.portalcnhfacil.com", // importante
    siteName: "Portal CNH Fácil",
    images: [
      {
        url: "https://www.portalcnhfacil.com/img/capa.png", // imagem pública!
        width: 1200,
        height: 630,
        alt: "Portal CNH Fácil",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Portal CNH Fácil",
    description: "Cursos e Treinamentos",
    images: ["https://www.portalcnhfacil.com/img/capa.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
