
"use client";

import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { ItineraryForm } from '@/components/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateTripItineraryOutput } from '@/ai/flows/generate-trip-itinerary';
import { PlaneTakeoff, Sparkles } from 'lucide-react';

interface GeneratedItineraryState {
  data: GenerateTripItineraryOutput;
  originalInput: {
    destination: string;
    travelDates: DateRange;
  };
}

export default function Home() {
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItineraryState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleItineraryGenerated = (
    data: GenerateTripItineraryOutput,
    originalInput: { destination: string; travelDates: DateRange }
  ) => {
    setGeneratedItinerary({ data, originalInput });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-4 md:px-8 bg-primary shadow-md">
        <div className="container mx-auto flex items-center gap-3">
          <PlaneTakeoff className="h-10 w-10 text-primary-foreground" />
          <h1 className="text-4xl font-headline font-bold text-primary-foreground">
            Gule Gule
          </h1>
        </div>
        <p className="container mx-auto text-lg text-primary-foreground/90 mt-1 font-body">
          Your AI-Powered Travel Companion
        </p>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary flex items-center">
                <Sparkles className="mr-2 h-7 w-7 text-accent" />
                Plan Your Next Adventure
              </CardTitle>
              <CardDescription>
                Fill in your travel preferences, and let our AI craft the perfect itinerary for you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItineraryForm
                onItineraryGenerated={handleItineraryGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </CardContent>
          </Card>

          <div className="w-full">
            {isGenerating && !generatedItinerary && (
              <Card className="w-full shadow-xl animate-pulse">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl text-primary">Generating...</CardTitle>
                  <CardDescription>Our AI is crafting your personalized itinerary. Please wait a moment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            )}
            {generatedItinerary && (
              <ItineraryDisplay
                itineraryText={generatedItinerary.data.itinerary}
                destination={generatedItinerary.originalInput.destination}
                travelDates={generatedItinerary.originalInput.travelDates}
              />
            )}
            {!isGenerating && !generatedItinerary && (
               <Card className="w-full shadow-xl border-dashed border-2">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-muted-foreground">Your Itinerary Awaits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Once you generate an itinerary, it will appear here. Get started by filling out the form!</p>
                  <div className="mt-6 flex justify-center">
                    <PlaneTakeoff className="h-24 w-24 text-muted opacity-20" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground font-body">
        <p>&copy; {new Date().getFullYear()} Gule Gule. Happy Travels!</p>
      </footer>
    </div>
  );
}
