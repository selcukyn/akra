
"use client";

import React from 'react';
import type { DateRange } from 'react-day-picker';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { generateICSFile } from "@/lib/calendar";
import { CalendarPlus, Info } from "lucide-react";

interface ItineraryDisplayProps {
  itineraryText: string;
  destination: string;
  travelDates: DateRange;
}

export function ItineraryDisplay({ itineraryText, destination, travelDates }: ItineraryDisplayProps) {
  const handleSaveToCalendar = () => {
    if (!travelDates.from || !travelDates.to) {
      alert("Travel dates are not fully specified.");
      return;
    }

    const eventDetails = {
      startDate: travelDates.from,
      endDate: travelDates.to,
      summary: `Trip to ${destination}`,
      description: `Your personalized Gule Gule itinerary for ${destination}:\n\n${itineraryText}`,
      location: destination,
    };

    const icsContent = generateICSFile(eventDetails);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GuleGule_Trip_to_${destination.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Basic parsing of itinerary text into paragraphs for better display
  const itineraryParagraphs = itineraryText.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary flex items-center">
          <Info className="mr-2 h-7 w-7 text-accent" />
          Your Personalized Itinerary
        </CardTitle>
        <CardDescription>
          Here's your AI-generated travel plan for {destination}.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <ScrollArea className="h-[400px] pr-4">
          {itineraryParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-sm leading-relaxed whitespace-pre-wrap font-body">
              {paragraph}
            </p>
          ))}
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button onClick={handleSaveToCalendar} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Save itinerary to calendar">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Save to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
}
