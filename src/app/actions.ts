
"use server";

import { generateTripItinerary, type GenerateTripItineraryInput, type GenerateTripItineraryOutput } from "@/ai/flows/generate-trip-itinerary";
import { z } from "zod";

const formSchema = z.object({
  origin: z.string().min(2, { message: "Origin must be at least 2 characters." }),
  destination: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  travelDates: z.object({
    from: z.date({ required_error: "Start date is required." }),
    to: z.date({ required_error: "End date is required." }),
  }),
  budget: z.string().min(1, { message: "Budget is required." }),
  desiredActivities: z.string().min(3, { message: "Please list some desired activities." }),
});

export type FormSchemaType = z.infer<typeof formSchema>;

interface HandleGenerateItineraryResult {
  success: boolean;
  data?: GenerateTripItineraryOutput;
  error?: string;
  inputUsed?: GenerateTripItineraryInput;
}

export async function handleGenerateItinerary(
  values: FormSchemaType
): Promise<HandleGenerateItineraryResult> {
  try {
    const aiInput: GenerateTripItineraryInput = {
      origin: values.origin,
      destination: values.destination,
      travelDates: `${values.travelDates.from.toISOString().split('T')[0]} to ${values.travelDates.to.toISOString().split('T')[0]}`,
      budget: values.budget,
      desiredActivities: values.desiredActivities,
    };

    const result = await generateTripItinerary(aiInput);
    return { success: true, data: result, inputUsed: aiInput };
  } catch (error) {
    console.error("Error generating itinerary:", error);
    let errorMessage = "Failed to generate itinerary. Please try again.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
