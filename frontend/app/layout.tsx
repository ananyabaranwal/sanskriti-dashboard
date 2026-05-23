import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sanskriti The Antique — India's Authentic Antique Marketplace",
  description: "Buy and sell authenticated Indian antiques. Verified sellers, GST invoices, secure payments.",
  keywords: "antiques india, buy antiques online, sell antiques, authenticated antiques",
  openGraph: {
    title: "Sanskriti The Antique",
    description: "India's Authentic Antique Marketplace",
    url: "https://sanskriti.vyrelle.in",
    siteName: "Sanskriti The Antique",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}