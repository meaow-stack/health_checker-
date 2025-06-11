'use server';

/**
 * @fileOverview An AI agent that analyzes user-inputted symptoms and provides potential causes.
 *
 * - symptomChatbot - A function that handles the symptom analysis process.
 * - SymptomChatbotInput - The input type for the symptomChatbot function.
 * - SymptomChatbotOutput - The return type for the symptomChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomChatbotInputSchema = z.object({
  symptoms: z.string().describe('The symptoms entered by the user.'),
});
export type SymptomChatbotInput = z.infer<typeof SymptomChatbotInputSchema>;

const SymptomChatbotOutputSchema = z.object({
  potentialCauses: z.string().describe('The potential causes of the symptoms.'),
});
export type SymptomChatbotOutput = z.infer<typeof SymptomChatbotOutputSchema>;

export async function symptomChatbot(input: SymptomChatbotInput): Promise<SymptomChatbotOutput> {
  return symptomChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomChatbotPrompt',
  input: {schema: SymptomChatbotInputSchema},
  output: {schema: SymptomChatbotOutputSchema},
  prompt: `You are a medical assistant. Analyze the symptoms entered by the user and provide potential causes.

Symptoms: {{{symptoms}}}`,
});

const symptomChatbotFlow = ai.defineFlow(
  {
    name: 'symptomChatbotFlow',
    inputSchema: SymptomChatbotInputSchema,
    outputSchema: SymptomChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
