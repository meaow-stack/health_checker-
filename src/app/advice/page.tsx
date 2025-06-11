import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ShieldCheck, Soup, BedDouble, Activity, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const healthAdvices = [
  {
    icon: <Soup className="h-8 w-8 text-primary" />,
    title: 'Nourish Your Body',
    description: 'Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins. Proper nutrition is fundamental to good health and can boost your immune system.',
    tips: [
      'Aim for at least 5 servings of fruits and vegetables daily.',
      'Choose whole grains like oats, quinoa, and brown rice.',
      'Stay hydrated by drinking plenty of water throughout the day.',
    ],
  },
  {
    icon: <BedDouble className="h-8 w-8 text-primary" />,
    title: 'Prioritize Sleep',
    description: 'Aim for 7-9 hours of quality sleep per night. Sleep is crucial for physical and mental recovery, hormone regulation, and cognitive function.',
    tips: [
      'Maintain a consistent sleep schedule, even on weekends.',
      'Create a relaxing bedtime routine.',
      'Ensure your bedroom is dark, quiet, and cool.',
    ],
  },
  {
    icon: <Activity className="h-8 w-8 text-primary" />,
    title: 'Stay Active',
    description: 'Incorporate regular physical activity into your routine. Exercise improves cardiovascular health, mood, and energy levels.',
    tips: [
      'Aim for at least 150 minutes of moderate-intensity aerobic exercise per week.',
      'Include strength training exercises 2-3 times a week.',
      'Find activities you enjoy to make exercise sustainable.',
    ],
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Manage Stress',
    description: 'Find healthy ways to cope with stress, such as mindfulness, meditation, yoga, or spending time in nature. Chronic stress can negatively impact your health.',
    tips: [
      'Practice deep breathing exercises for a few minutes daily.',
      'Engage in hobbies that you find relaxing and enjoyable.',
      'Don\'t hesitate to seek support from friends, family, or professionals.',
    ],
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Preventive Care',
    description: 'Schedule regular check-ups with your doctor and dentist. Preventive care can help detect health issues early when they are most treatable.',
    tips: [
      'Stay up-to-date with recommended vaccinations.',
      'Perform regular self-examinations as advised by your doctor.',
      'Understand your family health history.',
    ],
  },
];

export default function HealthAdvicePage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="General Health Advice"
        description="Discover tips and recommendations for a healthier lifestyle. Remember to consult a professional for personalized advice."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {healthAdvices.map((advice) => (
          <Card key={advice.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {advice.icon}
                <CardTitle className="font-headline text-xl">{advice.title}</CardTitle>
              </div>
              <CardDescription>{advice.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {advice.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-destructive/10 border-destructive/30 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <CardTitle className="text-destructive font-headline">Always Consult a Professional</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive/80 text-base">
            The information provided on this page is for general knowledge and informational purposes only, and does not constitute medical advice. It is essential to consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment. Do not disregard professional medical advice or delay in seeking it because of something you have read here.
          </CardDescription>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <Image 
          src="https://placehold.co/800x300.png" 
          alt="Healthy lifestyle banner"
          data-ai-hint="healthy lifestyle"
          width={800} 
          height={300}
          className="rounded-lg shadow-md mx-auto" 
        />
      </div>
    </div>
  );
}
