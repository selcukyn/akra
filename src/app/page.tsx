import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import TripadvisorWidget from "@/components/TripadvisorWidget";

const akraKemerMapsUrl = "https://goo.gl/maps/6n1nci8HkVZKXg8F7";

const CountdownPage = () => {
  // Mevcut kodunuzdaki dinamik sayaç ve diğer kodlar aynen korunmalı
  // Örnek olarak bir state veya custom hook ile dinamik sayaç kullanıyorsanız, burada da kullanmaya devam edin
  // Aşağıda timeLeft ve currentYear sabit değil, mevcut kodunuzdaki gibi alınmalı
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Buraya mevcut sayaç hesaplama fonksiyonunuzu koyun
    // Örneğin:
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-07-01T00:00:00+03:00"); // örnek tarih, sizde nasılsa öyle kullanın
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    setCurrentYear(new Date().getFullYear());

    return () => clearInterval(timer);
  }, []);

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
        <div className="flex flex-row items-center justify-center space-x-4 mb-8">
          <div className="bg-black/30 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
            <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-primary" id="days">{timeLeft.days}</div>
            <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-1 text-white/90">Gün</div>
          </div>
          <div className="bg-black/30 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
            <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-primary" id="hours">{timeLeft.hours}</div>
            <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-1 text-white/90">Saat</div>
          </div>
          <div className="bg-black/30 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
            <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-primary" id="minutes">{timeLeft.minutes}</div>
            <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-1 text-white/90">Dakika</div>
          </div>
          <div className="bg-black/30 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
            <div className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-primary" id="seconds">{timeLeft.seconds}</div>
            <div className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-1 text-white/90">Saniye</div>
          </div>
        </div>
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
      {/* Tripadvisor yorumları widget'ı */}
      <TripadvisorWidget />
      <footer className="absolute bottom-4 text-center text-white/70 text-sm z-10">
        {currentYear !== null && <> &copy; {currentYear} Akra Kemer Countdown.</>}
      </footer>
    </div>
  );
};

export default function Home() {
  return <CountdownPage />;
}
