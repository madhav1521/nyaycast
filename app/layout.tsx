import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://manasagravat.com"),
  title: {
    default: "Manas A. Agravat & Associates | Advocate in Ahmedabad",
    template: "%s | Manas A. Agravat & Associates",
  },
  description:
    "Client-focused legal representation in Ahmedabad for civil, criminal, property, consumer, and corporate matters.",
  keywords: [
    "advocate in Ahmedabad",
    "lawyer in Ahmedabad",
    "civil lawyer",
    "criminal lawyer",
    "property lawyer",
    "Manas Agravat",
  ],
  icons: {
    icon: "/images/manas-logo.png",
    shortcut: "/images/manas-logo.png",
    apple: "/images/manas-logo.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Manas A. Agravat & Associates | Advocate in Ahmedabad",
    description: "Client-focused legal representation in Ahmedabad.",
    images: [
      {
        url: "/images/manas-logo.png",
        width: 1200,
        height: 630,
        alt: "Manas A. Agravat & Associates Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manas A. Agravat & Associates",
    description: "Legal counsel in Ahmedabad.",
    images: ["/images/manas-logo.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${sourceSans.variable} font-sans h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col justify-between bg-[#f8f6f0] text-[#17253d] selection:bg-[#b8955d]/20 overflow-x-hidden w-full font-sans">
        {children}
      </body>
    </html>
  );
}
