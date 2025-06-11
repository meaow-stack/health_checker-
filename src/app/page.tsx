
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import Link from "next/link";
import { BotMessageSquare, ClipboardCheck, Activity, BookOpenText, HeartPulse } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Welcome to HealthWise Assistant"
        description="Your intelligent partner for understanding symptoms, exploring health insights, and tracking your well-being."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
        <FeatureCard
          icon={<BotMessageSquare className="h-10 w-10 text-primary" />}
          title="Symptom Chatbot"
          description="Engage with our AI chatbot to analyze your symptoms and explore potential causes."
          link="/chatbot"
          linkText="Try the Chatbot"
        />
        <FeatureCard
          icon={<ClipboardCheck className="h-10 w-10 text-primary" />}
          title="Disease Prediction"
          description="Get an AI-powered assessment of possible diseases based on your reported symptoms."
          link="/prediction"
          linkText="Predict Diseases"
        />
        <FeatureCard
          icon={<Activity className="h-10 w-10 text-primary" />}
          title="Symptom Tracking"
          description="Monitor your symptoms over time, visualize trends, and keep detailed notes."
          link="/tracking"
          linkText="Track Symptoms"
        />
        <FeatureCard
          icon={<BookOpenText className="h-10 w-10 text-primary" />}
          title="Health Advice"
          description="Access general health recommendations and tips for a healthier lifestyle."
          link="/advice"
          linkText="Get Advice"
        />
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <HeartPulse className="h-12 w-12 text-accent" />
            <div>
              <CardTitle className="text-2xl font-headline">Your Health Journey, Simplified</CardTitle>
              <CardDescription className="text-md">
                HealthWise Assistant is designed to empower you with information and tools.
                Remember, our tools provide insights but WE do not replace professional medical advice. PLEASE SEEK MEDICAL ADVISE IF URGENT.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4">
              <p className="text-foreground/80">
                Navigate through our features to gain a better understanding of your health. 
                Whether you're curious about a new symptom, want to track your progress, or 
                simply looking for general wellness tips, HealthWise is here to assist you.
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>AI-powered analysis for quick insights.</li>
                <li>Personalized symptom tracking and visualization.</li>
                <li>Curated health advice for everyday well-being.</li>
                <li>User-friendly interface for easy navigation.</li>
              </ul>
              <div className="mt-4">
                 <Link href="/chatbot">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Get Started
                    </Button>
                 </Link>
              </div>
            </div>
            {/* The div containing the placeholder image has been removed */}
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 p-6 bg-secondary/30 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-center mb-4 font-headline">Important Disclaimer</h3>
          <p className="text-sm text-center text-muted-foreground">
            HealthWise Assistant provides information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
          </p>
      </div>

    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardContent>
        <Link href={link} passHref>
          <Button variant="outline" className="w-full">
            {linkText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
