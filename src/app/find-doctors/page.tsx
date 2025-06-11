
import { PageHeader } from '@/components/common/page-header';
import FindDoctorsClient from '@/components/doctors/find-doctors-client';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FindDoctorsPage() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div className="container mx-auto">
        <PageHeader
          title="Find Nearby Doctors"
          description="Get assistance locating healthcare professionals in your area."
        />
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive font-headline">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-destructive/80">
              The Google Maps API key is missing. This feature cannot be loaded. Please ensure the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is set correctly.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Find Nearby Doctors"
        description="Allow location access to find healthcare professionals in your area."
      />
      <FindDoctorsClient apiKey={googleMapsApiKey} />
       <Card className="mt-8 bg-destructive/10 border-destructive/30 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <CardTitle className="text-destructive font-headline">Important Note</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive/80 text-base">
            This tool provides information based on Google Maps data and is for informational purposes only. It does not constitute a recommendation or endorsement of any specific healthcare provider. Always verify information and consult with trusted sources before making healthcare decisions.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
