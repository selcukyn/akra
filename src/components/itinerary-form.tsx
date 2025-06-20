
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import type { GenerateTripItineraryOutput } from "@/ai/flows/generate-trip-itinerary";
import type { FormSchemaType } from "@/app/actions";
import { handleGenerateItinerary } from "@/app/actions";

import { MapPin, CalendarDays, BadgeDollarSign, ListChecks, Wand2, Loader2 } from "lucide-react";
import React from "react";

const formSchema = z.object({
  origin: z.string().min(2, { message: "Origin must be at least 2 characters." }),
  destination: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  travelDates: z.object({
    from: z.date({ required_error: "Start date is required." }),
    to: z.date({ required_error: "End date is required." }),
  }, { required_error: "Travel dates are required." })
  .refine(data => data.from < data.to, {
    message: "End date must be after start date.",
    path: ["to"],
  }),
  budget: z.string().min(1, { message: "Budget is required (e.g., $1000, €500)." }),
  desiredActivities: z.string().min(3, { message: "Please list some desired activities (e.g., sightseeing, hiking)." }),
});

interface ItineraryFormProps {
  onItineraryGenerated: (
    data: GenerateTripItineraryOutput,
    originalInput: { destination: string; travelDates: DateRange }
  ) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export function ItineraryForm({ onItineraryGenerated, isGenerating, setIsGenerating }: ItineraryFormProps) {
  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      travelDates: undefined,
      budget: "",
      desiredActivities: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    setIsGenerating(true);
    try {
      const result = await handleGenerateItinerary(values);
      if (result.success && result.data && result.inputUsed) {
        onItineraryGenerated(result.data, {
          destination: result.inputUsed.destination,
          travelDates: values.travelDates as DateRange, // Already validated to be DateRange
        });
        toast({
          title: "Itinerary Generated!",
          description: "Your personalized travel plan is ready.",
        });
        form.reset(); // Optionally reset form
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: result.error || "There was a problem with your request.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-accent" />
                  Origin
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., New York City" {...field} disabled={isGenerating} aria-label="Origin city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-accent" />
                  Destination
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Paris, France" {...field} disabled={isGenerating} aria-label="Destination city"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="travelDates"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-accent" />
                Travel Dates
              </FormLabel>
              <DateRangePicker
                date={field.value}
                onDateChange={field.onChange}
                disabled={isGenerating}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <BadgeDollarSign className="mr-2 h-5 w-5 text-accent" />
                Budget
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., $2000 USD, €1500" {...field} disabled={isGenerating} aria-label="Travel budget" />
              </FormControl>
              <FormDescription>
                Enter your estimated budget for the trip (include currency).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desiredActivities"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-accent" />
                Desired Activities
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Visit museums, try local cuisine, go hiking, relax on the beach..."
                  className="resize-none"
                  {...field}
                  disabled={isGenerating}
                  aria-label="Desired activities for the trip"
                />
              </FormControl>
              <FormDescription>
                List activities you're interested in, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isGenerating} aria-label="Generate Itinerary Button">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Itinerary
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
