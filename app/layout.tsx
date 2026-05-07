import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import CarritoProvider from "@/contexts/CarritoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminShell from "@/components/AdminShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GottLab - Plantas In Vitro Exclusivas",
  description: "Descubre plantas cultivadas en laboratorio con la más alta tecnología. Especies raras, variedades exclusivas y calidad garantizada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <CarritoProvider>
              <AdminShell>
                {children}
              </AdminShell>
            </CarritoProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
