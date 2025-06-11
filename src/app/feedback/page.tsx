
'use client';

import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquareQuote, Send, Star } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FeedbackFormSchema = z.object({
  rating: z.enum(['1', '2', '3', '4', '5'], { required_error: 'Please select a rating.' }),
  category: z.enum(['bug', 'feature', 'general', 'other'], { required_error: 'Please select a category.' }),
  comments: z.string().min(10, { message: 'Comments must be at least 10 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
});

type FeedbackFormValues = z.infer<typeof FeedbackFormSchema>;

export default function FeedbackPage() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      comments: '',
    },
  });

  const onSubmit = (data: FeedbackFormValues) => {
    console.log('Feedback form data:', data);
    toast({
      title: 'Feedback Submitted (Placeholder)',
      description: "Thank you for your feedback! We appreciate you helping us improve. (This is a placeholder, data was logged to console).",
    });
    form.reset({ comments: ''});
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Share Your Feedback"
        description="Help us improve HealthWise Assistant by sharing your thoughts, suggestions, or any issues you've encountered."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><MessageSquareQuote className="h-6 w-6 text-primary" /> Tell Us What You Think</CardTitle>
              <CardDescription>Your input is valuable to us.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Overall Experience Rating <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            {[1, 2, 3, 4, 5].map(rate => (
                              <FormItem key={rate} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={String(rate)} id={`rating-${rate}`} />
                                </FormControl>
                                <FormLabel htmlFor={`rating-${rate}`} className="font-normal flex items-center">
                                  {Array(rate).fill(0).map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-0.5" />)}
                                  {Array(5-rate).fill(0).map((_, i) => <Star key={i+rate} className="h-5 w-5 text-yellow-400 mr-0.5" />)}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Feedback Category <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="bug" id="cat-bug" /></FormControl>
                              <FormLabel htmlFor="cat-bug" className="font-normal">Bug Report</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="feature" id="cat-feature" /></FormControl>
                              <FormLabel htmlFor="cat-feature" className="font-normal">Feature Request</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="general" id="cat-general" /></FormControl>
                              <FormLabel htmlFor="cat-general" className="font-normal">General Comment</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="other" id="cat-other" /></FormControl>
                              <FormLabel htmlFor="cat-other" className="font-normal">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Comments <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com (if you'd like a response)" {...field} />
                        </FormControl>
                         <FormDescription>
                            We'll only use this to contact you about your feedback if necessary.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" /> Submit Feedback
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
            <Card className="bg-accent/20 border-accent/40 shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline text-accent-foreground/90">Why Your Feedback Matters</CardTitle>
                </CardHeader>
                <CardContent className="text-accent-foreground/80 space-y-2">
                    <p>Your insights help us understand what we're doing well and where we can improve.</p>
                    <p>Whether it's a small typo, a brilliant idea for a new feature, or general impressions, every piece of feedback contributes to making HealthWise Assistant better for everyone.</p>
                </CardContent>
            </Card>
            <Image 
                src="https://placehold.co/400x300.png" 
                alt="Feedback illustration"
                data-ai-hint="feedback ideas"
                width={400} 
                height={300}
                className="rounded-lg shadow-md w-full object-cover" 
              />
        </div>
      </div>
    </div>
  );
}
