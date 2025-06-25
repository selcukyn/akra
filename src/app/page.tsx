"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Navigation } from 'lucide-react';
import Image from 'next/image';

const CountdownPage = () => {
  const targetDate = new Date('2025-07-20T00:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  // Tüm wallpapers'ı API'den çek
  useEffect(() => {
    fetch('/api/wallpapers')
      .then((res) => res.json())
      .then((data: string[]) => {
        setWallpapers(data);
        // Saat başında uygun index ile başla
        if (data.length > 0) {
          const initialIndex = new Date().getHours() % data.length;
          setWallpaperIndex(initialIndex);
        }
      });
  }, []);

  // Saat başı otomatik wallpaper değiştir
  useEffect(() => {
    if (wallpapers.length === 0) return;
    const interval = setInterval(() => {
      setWallpaperIndex((new Date().getHours()) % wallpapers.length);
    }, 1000 * 60); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, [wallpapers]);

  // Geri sayım hesaplama
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    setCurrentYear(new Date().getFullYear());

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  // Manuel wallpaper değişikliği
  const goToNextWallpaper = () => {
    setWallpaperIndex((prev) =>
      wallpapers.length > 0 ? (prev + 1) % wallpapers.length : 0
    );
  };

  const akraKemerMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Akra+Kemer";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-primary selection:text-primary-foreground"
    >
      {/* Dinamik arka plan */}
      {wallpapers.length > 0 && (
        <Image
          src={wallpapers[wallpaperIndex]}
          alt="Arka Plan"
          fill
          className="absolute inset-0 z-0 object-cover transition-all duration-500"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50 z-0"></div> {/* Koyu overlay */}

      <div className="relative z-10 flex flex-col items-center text-center bg-white/10 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white flex items-center">
          <button
            onClick={goToNextWallpaper}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              marginRight: "0.75rem",
              cursor: "pointer"
            }}
            aria-label="Arkaplanı değiştir"
          >
            <Clock className="mr-2 sm:mr-3 h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </button>
          Tatile Kalan Zaman
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 w-full">
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
      <footer className="absolute bottom-4 text-center text-white/70 text-sm z-10">
        {currentYear !== null && <> &copy; {currentYear} Akra Kemer Countdown.</>}
      </footer>
    </div>
  );
};

export default function Home() {
  return <CountdownPage />;
}
