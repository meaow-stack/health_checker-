import { PageHeader } from '@/components/common/page-header';
import SymptomChatbotClient from '@/components/chatbot/symptom-chatbot-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function SymptomChatbotPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Symptom Chatbot"
        description="Describe your symptoms and our AI will provide potential insights. This is not a diagnostic tool."
      />
      
      <Card className="mb-6 bg-destructive/10 border-destructive/30">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive font-headline">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive/80">
            The Symptom Chatbot provides information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.
          </CardDescription>
        </CardContent>
      </Card>

      <SymptomChatbotClient />
    </div>
  );
}
