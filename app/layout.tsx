import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getSiteData } from "@/lib/data";
import { SITE_NAME, fmtUpdated } from "@/lib/tournament";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const cond = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-cond" });

const DESCRIPTION =
  "Daftar jadwal turnamen tenis meja (ping pong) di Indonesia: tanggal, kota, kategori, biaya, dan kontak panitia.";

export const metadata: Metadata = {
  metadataBase: new URL("https://pingpox.com"),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  openGraph: { type: "website", locale: "id_ID", siteName: SITE_NAME, title: SITE_NAME, description: DESCRIPTION, url: "/" },
};

export const viewport: Viewport = { themeColor: "#0b0c10", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const updated = fmtUpdated(getSiteData().updatedAt);
  return (
    <html lang="id" className={`${body.variable} ${cond.variable}`}>
      <body>
        <SiteHeader updated={updated} />
        {children}
        <SiteFooter updated={updated} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
