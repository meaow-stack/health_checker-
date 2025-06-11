
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Users, Lightbulb } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="About HealthWise Assistant"
        description="Learn more about our mission, vision, and the team behind HealthWise."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <HeartPulse className="h-10 w-10 text-primary" />
              <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              At HealthWise Assistant, our mission is to empower individuals to take a proactive role in their health journey. We aim to provide accessible, AI-driven insights and tools that help users understand their symptoms, track their well-being, and make informed decisions about their health, always encouraging consultation with healthcare professionals for diagnosis and treatment.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-10 w-10 text-accent" />
              <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">
              We envision a future where technology and healthcare work hand-in-hand to make health information more understandable and actionable for everyone. HealthWise Assistant strives to be a trusted companion, offering preliminary guidance and fostering a greater awareness of personal health patterns, ultimately leading to better health outcomes.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl mb-12">
        <CardHeader className="text-center">
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-3xl">The Technology</CardTitle>
          <CardDescription>
            HealthWise Assistant is built by a dedicated AI partner leveraging cutting-edge technologies to bring you reliable and intuitive health tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-foreground/80 max-w-2xl mx-auto">
            This application is a demonstration of what's possible with modern web technologies and AI. It utilizes Next.js for a robust front-end experience, ShadCN UI for beautiful and accessible components, Tailwind CSS for styling, and Genkit for its AI-powered features. We are committed to continuous improvement and user privacy.
          </p>
          <div className="mt-8">
            <Image
              src="https://placehold.co/700x350.png"
              alt="Team or technology abstract graphic"
              data-ai-hint="technology abstract"
              width={700}
              height={350}
              className="rounded-lg shadow-md mx-auto"
            />
          </div>
        </CardContent>
      </Card>
       <Card className="bg-destructive/10 border-destructive/30 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <Users className="h-8 w-8 text-destructive" />
          <CardTitle className="text-destructive font-headline">Not a Medical Service</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive/80 text-base">
            HealthWise Assistant is an informational tool and does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
