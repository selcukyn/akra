import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import TripadvisorWidget from "@/components/TripadvisorWidget";

const akraKemerMapsUrl = "https://goo.gl/maps/6n1nci8HkVZKXg8F7";

function getCurrentYear() {
  if (typeof window !== "undefined") {
    return new Date().getFullYear();
  }
  return null;
}

export default function Home() {
  const currentYear = getCurrentYear();

  // ... diğer kodlar ...

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src="https://www.akrahotels.com/media/1due0kcv/akra-kemer-anasayfa-promo.jpg?format=webp&quality=75"
        alt="Akra Kemer Background"
        fill
        className="absolute inset-0 z-0 object-cover"
        data-ai-hint="hotel beach"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative z-10 flex flex-col items-center text-center bg-white/10 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white flex items-center">
          <Clock className="mr-2 sm:mr-3 h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          Tatile Kalan Zaman
        </h1>
        {/* ...Sayaç ve diğer içerikler... */}
        <Button
          onClick={() => window.open(akraKemerMapsUrl, '_blank')}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg transition-transform hover:scale-105"
          aria-label="Akra Kemer için yol tarifi al"
        >
          <Navigation className="mr-2 h-5 w-5" />
          Yol Tarifi
        </Button>
      </div>
      {/* Tripadvisor yorumları */}
      <div className="relative z-10 mt-8 w-full max-w-3xl flex justify-center">
        <TripadvisorWidget />
      </div>
      <footer className="absolute bottom-4 text-center text-white/70 text-sm z-10">
        {currentYear !== null && <> &copy; {currentYear} Akra Kemer Countdown.</>}
      </footer>
    </div>
  );
}
