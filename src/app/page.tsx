
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import Link from "next/link";
import { BotMessageSquare, ClipboardCheck, Activity, BookOpenText, HeartPulse, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <section className="text-center py-12 md:py-20">
        <HeartPulse className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Welcome to HealthWise Assistant
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your intelligent partner for understanding symptoms, exploring health insights, and tracking your well-being.
        </p>
         <div className="mt-8 flex justify-center gap-4">
            <Link href="/chatbot">
                <Button size="lg">
                    Start Symptom Analysis <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Link href="/tracking">
                <Button size="lg" variant="outline">
                    Track Your Symptoms
                </Button>
            </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        <FeatureCard
          icon={<BotMessageSquare className="h-8 w-8 text-primary" />}
          title="Symptom Chatbot"
          description="Engage with our AI chatbot to analyze your symptoms and explore potential causes."
          link="/chatbot"
        />
        <FeatureCard
          icon={<ClipboardCheck className="h-8 w-8 text-primary" />}
          title="Disease Prediction"
          description="Get an AI-powered assessment of possible diseases based on your reported symptoms."
          link="/prediction"
        />
        <FeatureCard
          icon={<Activity className="h-8 w-8 text-primary" />}
          title="Symptom Tracking"
          description="Monitor your symptoms over time, visualize trends, and keep detailed notes."
          link="/tracking"
        />
        <FeatureCard
          icon={<BookOpenText className="h-8 w-8 text-primary" />}
          title="Health Advice"
          description="Access general health recommendations and tips for a healthier lifestyle."
          link="/advice"
        />
      </section>

      <Card className="shadow-xl mb-16 overflow-hidden">
        <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-10 w-10 text-accent" />
                <CardTitle className="text-2xl lg:text-3xl font-headline">Your Health Journey, Simplified</CardTitle>
              </div>
              <CardDescription className="text-md lg:text-lg mb-4">
                HealthWise Assistant is designed to empower you with information and tools. Remember, our tools provide insights but do not replace professional medical advice.
              </CardDescription>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
                <li>AI-powered analysis for quick insights.</li>
                <li>Personalized symptom tracking and visualization.</li>
                <li>Curated health advice for everyday well-being.</li>
                <li>User-friendly interface for easy navigation.</li>
              </ul>
              <Link href="/about">
                <Button variant="link" className="px-0">
                    Learn more about our mission <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block h-full">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Abstract health and technology"
                data-ai-hint="health technology"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
      </Card>

      <div className="mt-12 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-center mb-4 font-headline">Important Disclaimer</h3>
          <p className="text-sm text-center text-muted-foreground max-w-3xl mx-auto">
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
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Link href={link} className="group">
      <Card className="flex flex-col text-center items-center p-6 h-full shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="bg-primary/10 p-3 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <CardTitle className="font-headline text-lg mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground flex-grow">{description}</p>
          <div className="mt-4 text-sm font-medium text-primary group-hover:underline">
            Learn More <ArrowRight className="inline-block h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
      </Card>
    </Link>
  );
}
