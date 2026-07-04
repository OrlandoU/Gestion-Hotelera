import type { Metadata } from "next";
import { Hanken_Grotesk, Manrope, Inter } from "next/font/google";
import "./globals.css";
import "material-symbols";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel San Pedro | Modern Heritage Since 1960",
  description: "Cincuenta años de hospitalidad tradicional reinterpretados para el viajero contemporáneo en el corazón de San Pedro Sula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("scroll-smooth", "font-sans", inter.variable)}>
      <body className={`${hanken.variable} ${manrope.variable} bg-background text-primary font-body-md overflow-x-hidden selection:bg-lavender-accent selection:text-navy-dark`}>
        {/* Inject global client shortcuts safely here */}
        <KeyboardShortcuts />
        {children}
      </body>
    </html>
  );
}