'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { predictDisease, type PredictDiseaseOutput } from '@/ai/flows/disease-prediction';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const PredictionFormSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please provide a detailed list of symptoms (at least 10 characters).' }),
});

type PredictionFormValues = z.infer<typeof PredictionFormSchema>;

export default function DiseasePredictorClient() {
  const [predictionResult, setPredictionResult] = useState<PredictDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(PredictionFormSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit: SubmitHandler<PredictionFormValues> = async (data) => {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const result = await predictDisease({ symptoms: data.symptoms });
      setPredictionResult(result);
    } catch (error) {
      console.error('Disease Prediction Error:', error);
      toast({
        title: "Error Predicting Disease",
        description: "An error occurred while trying to predict diseases. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceBadgeVariant = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'default'; // Or a success-like color
      case 'medium':
        return 'secondary'; // Or a warning-like color
      case 'low':
        return 'outline'; // Or a neutral color
      default:
        return 'outline';
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Enter Your Symptoms</CardTitle>
          <CardDescription>
            List your symptoms clearly, separated by commas or new lines. For example: "Fever, persistent cough, body aches".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Headache, fatigue, sore throat, mild fever"
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Prediction
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className={`transition-opacity duration-500 ease-in-out shadow-lg ${predictionResult || isLoading ? 'opacity-100' : 'opacity-50'}`}>
        <CardHeader>
          <CardTitle className="font-headline">Prediction Results</CardTitle>
          <CardDescription>
            Based on the symptoms you provided, here's what our AI suggests.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p>Analyzing your symptoms...</p>
            </div>
          )}
          {!isLoading && !predictionResult && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p>Results will appear here once you submit your symptoms.</p>
            </div>
          )}
          {predictionResult && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary font-headline">Possible Diseases:</h3>
                <p className="text-foreground/90 whitespace-pre-wrap">{predictionResult.possibleDiseases || "No specific diseases identified."}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary font-headline">Confidence Level:</h3>
                <Badge variant={getConfidenceBadgeVariant(predictionResult.confidenceLevel)}>
                  {predictionResult.confidenceLevel ? predictionResult.confidenceLevel.charAt(0).toUpperCase() + predictionResult.confidenceLevel.slice(1) : "N/A"}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary font-headline">Recommended Next Steps:</h3>
                <p className="text-foreground/90 whitespace-pre-wrap">{predictionResult.nextSteps || "Please consult a healthcare professional for further guidance."}</p>
              </div>
            </div>
          )}
        </CardContent>
        {predictionResult && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              This prediction is AI-generated and not a medical diagnosis. Always consult a healthcare professional.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
