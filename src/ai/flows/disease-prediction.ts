'use server';

/**
 * @fileOverview Implements a Genkit flow for predicting possible diseases based on user-provided symptoms.
 *
 * - predictDisease - Predicts possible diseases based on symptoms.
 * - PredictDiseaseInput - The input type for the predictDisease function.
 * - PredictDiseaseOutput - The return type for the predictDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDiseaseInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma-separated list of symptoms experienced by the user.'),
});
export type PredictDiseaseInput = z.infer<typeof PredictDiseaseInputSchema>;

const PredictDiseaseOutputSchema = z.object({
  possibleDiseases: z
    .string()
    .describe('A list of possible diseases based on the symptoms provided.'),
  confidenceLevel: z
    .string()
    .describe('The confidence level of the prediction (low, medium, high).'),
  nextSteps: z
    .string()
    .describe(
      'Recommended next steps, such as consulting a doctor or further tests.'
    ),
});
export type PredictDiseaseOutput = z.infer<typeof PredictDiseaseOutputSchema>;

export async function predictDisease(input: PredictDiseaseInput): Promise<PredictDiseaseOutput> {
  return predictDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDiseasePrompt',
  input: {schema: PredictDiseaseInputSchema},
  output: {schema: PredictDiseaseOutputSchema},
  model: 'googleai/gemini-1.5-pro-latest',
  prompt: `You are an AI health assistant that can predict possible diseases based on the symptoms a user provides.

  Analyze the symptoms provided by the user and predict possible diseases.
  Also, provide a confidence level for the prediction (low, medium, or high).
  Finally, recommend the next steps the user should take based on the prediction.

  Symptoms: {{{symptoms}}}
  `,
});

const predictDiseaseFlow = ai.defineFlow(
  {
    name: 'predictDiseaseFlow',
    inputSchema: PredictDiseaseInputSchema,
    outputSchema: PredictDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
