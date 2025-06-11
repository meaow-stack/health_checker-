
'use client';

import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

export default function ContactUsPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log('Contact form data:', data);
    toast({
      title: 'Message Sent (Placeholder)',
      description: "Thank you for contacting us! We'll be in touch soon. (This is a placeholder, no email was actually sent).",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you. Send us a message or find our contact details below."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Send className="h-6 w-6 text-primary" /> Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Regarding..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your message here..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Mail className="h-6 w-6 text-primary" /> Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Our (Placeholder) Office</h3>
                            <p className="text-muted-foreground">123 HealthWise Street, Wellness City, HW 54321</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Email Us</h3>
                            <p className="text-muted-foreground">
                                <a href="mailto:info@healthwise.example.com" className="hover:underline">info@healthwise.example.com</a> (Placeholder)
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Call Us</h3>
                            <p className="text-muted-foreground">+1 (555) 123-4567 (Placeholder)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <div className="mt-6">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Contact us illustration"
                data-ai-hint="contact support"
                width={600} 
                height={400}
                className="rounded-lg shadow-md w-full object-cover" 
              />
            </div>
        </div>
      </div>
    </div>
  );
}
