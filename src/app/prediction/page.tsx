import { PageHeader } from '@/components/common/page-header';
import DiseasePredictorClient from '@/components/prediction/disease-predictor-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DiseasePredictionPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Disease Prediction"
        description="Enter your symptoms to get an AI-based prediction of possible conditions. This is not a diagnostic tool."
      />

      <Card className="mb-6 bg-destructive/10 border-destructive/30">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive font-headline">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive/80">
            The Disease Predictor provides information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health.
          </CardDescription>
        </CardContent>
      </Card>
      
      <DiseasePredictorClient />
    </div>
  );
}
