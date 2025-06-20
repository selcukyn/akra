// src/ai/flows/generate-trip-itinerary.ts
'use server';

/**
 * @fileOverview Generates a personalized trip itinerary based on user preferences.
 *
 * - generateTripItinerary - A function that generates a personalized trip itinerary.
 * - GenerateTripItineraryInput - The input type for the generateTripItinerary function.
 * - GenerateTripItineraryOutput - The return type for the generateTripItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTripItineraryInputSchema = z.object({
  origin: z.string().describe('The starting location of the trip.'),
  destination: z.string().describe('The desired destination of the trip.'),
  travelDates: z.string().describe('The start and end dates for the trip (e.g., "2024-01-01 to 2024-01-07").'),
  budget: z.string().describe('The budget for the trip (e.g., "$1000", "€500", or "£750").'),
  desiredActivities: z
    .string()
    .describe(
      'A comma-separated list of activities the user wants to do on the trip (e.g., "sightseeing, hiking, museums").'
    ),
});
export type GenerateTripItineraryInput = z.infer<typeof GenerateTripItineraryInputSchema>;

const GenerateTripItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed itinerary for the trip, including daily activities, locations, and estimated costs.'),
});
export type GenerateTripItineraryOutput = z.infer<typeof GenerateTripItineraryOutputSchema>;

export async function generateTripItinerary(input: GenerateTripItineraryInput): Promise<GenerateTripItineraryOutput> {
  return generateTripItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTripItineraryPrompt',
  input: {schema: GenerateTripItineraryInputSchema},
  output: {schema: GenerateTripItineraryOutputSchema},
  prompt: `You are a travel agent who specializes in creating personalized trip itineraries. Based on the user's preferences, create a detailed itinerary for their trip. The itinerary should include daily activities, locations, and estimated costs.

Here are the user's preferences:

Origin: {{{origin}}}
Destination: {{{destination}}}
Travel Dates: {{{travelDates}}}
Budget: {{{budget}}}
Desired Activities: {{{desiredActivities}}}

Create a detailed itinerary:
`,
});

const generateTripItineraryFlow = ai.defineFlow(
  {
    name: 'generateTripItineraryFlow',
    inputSchema: GenerateTripItineraryInputSchema,
    outputSchema: GenerateTripItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
