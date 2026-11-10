import { getPublicEvents, getSettings } from "@/lib/queries";
import { isUpcoming } from "@/lib/dates";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Journey } from "@/components/sections/Journey";
import { EventStrip } from "@/components/sections/EventStrip";
import { Faq } from "@/components/sections/Faq";
import { JoinCta } from "@/components/sections/JoinCta";
import { Reveal } from "@/components/ui/Reveal";

export default async function HomePage() {
  // Hapus getPublicAlbums dari sini karena udah ga dipake
  const [settings, eventResult] = await Promise.all([
    getSettings(),
    getPublicEvents(),
  ]);
  const { events } = eventResult;

  const upcomingEvents = events.filter((event) => isUpcoming(event.event_date, event.start_time));
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const registerHref = nextEvent ? `/acara/${nextEvent.slug}#daftar` : "/acara";

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero nextEvent={nextEvent} settings={settings} />
      
      <Reveal>
        <About settings={settings} />
      </Reveal>

      <Reveal>
        <Features />
      </Reveal>

      <Reveal>
        <Journey />
      </Reveal>

      <Reveal>
        <EventStrip events={upcomingEvents} />
      </Reveal>

      {/* Section GalleryGrid udah dihapus total dari sini */}

      <Reveal>
        <Faq />
      </Reveal>

      <Reveal>
        <JoinCta registerHref={registerHref} />
      </Reveal>
    </div>
  );
}