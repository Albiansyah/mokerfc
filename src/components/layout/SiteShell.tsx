"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";
import { BottomNav } from "./BottomNav";
import { isAdminRoute } from "@/lib/navigation";
import type { Settings } from "@/lib/types";

export function SiteShell({
  children,
  registerHref,
  settings,
}: {
  children: React.ReactNode;
  registerHref: string;
  settings: Settings;
}) {
  const pathname = usePathname();
  if (isAdminRoute(pathname)) return children;

  return (
    <>
      <SkipLink />
      <Header
        registerHref={registerHref}
        waAdmin1={settings.wa_admin_1}
        waAdmin2={settings.wa_admin_2}
        instagram={settings.instagram}
      />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pb-16 md:pb-0">
        {children}
      </main>
      <Footer settings={settings} />
      <BottomNav />
    </>
  );
}