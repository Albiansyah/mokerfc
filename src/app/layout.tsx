import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { getSettings, getPublicEvents } from "@/lib/queries";
import { isUpcoming } from "@/lib/dates";

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Moker FC United",
    default: "Moker FC United | Mini Soccer Mojokerto",
  },
  description:
    "Klub mini soccer dari Mojokerto, terbuka untuk siapa saja yang mau main. Jadwal main, pendaftaran laga, dan sparring.",
  metadataBase: new URL("https://mokerfc.vercel.app"),
  openGraph: {
    title: "Moker FC United",
    description:
      "Klub mini soccer dari Mojokerto, terbuka untuk siapa saja yang mau main.",
    siteName: "Moker FC United",
    locale: "id_ID",
    type: "website",
    images: ["/brand/logo-full.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const { events } = await getPublicEvents();

  // Cari acara terdekat yang statusnya published dan kuota belum penuh
  const upcomingActive = events.find(
    (e) =>
      e.status === "published" &&
      isUpcoming(e.event_date, e.start_time) &&
      (!e.quota_total || (e.counts?.total || 0) < e.quota_total)
  );
  const registerHref = upcomingActive ? `/acara/${upcomingActive.slug}#daftar` : "/acara";

  return (
    <html
      lang="id"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("moker_theme");if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <SiteShell registerHref={registerHref} settings={settings}>{children}</SiteShell>
      </body>
    </html>
  );
}
