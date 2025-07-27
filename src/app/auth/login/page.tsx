
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

// Simple SVG Google Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.64 12.2045C20.64 11.6045 20.58 11.0045 20.46 10.4205H12V13.8409H16.8364C16.6323 14.7591 16.0364 15.5455 15.1909 16.1182V18.45H17.9182C19.6455 16.8909 20.64 14.7318 20.64 12.2045Z"
      fill="#4285F4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 21C14.4409 21 16.5227 20.1864 17.9182 18.45L15.1909 16.1182C14.3727 16.6591 13.2818 17.0045 12 17.0045C9.52273 17.0045 7.42045 15.4091 6.64545 13.0727H3.79545V15.4818C5.23182 18.6636 8.35455 21 12 21Z"
      fill="#34A853"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.64545 13.0727C6.44545 12.4773 6.32273 11.8409 6.32273 11.1818C6.32273 10.5227 6.44545 9.88636 6.62727 9.29091V6.88182H3.79545C3.32273 7.82273 3 8.91818 3 10.0909C3 11.2636 3.32273 12.3591 3.79545 13.2909L6.64545 13.0727Z"
      fill="#FBBC05"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6.27273C13.35 6.27273 14.5136 6.75909 15.4818 7.68182L18.0045 5.15909C16.5182 3.84545 14.4364 3 12 3C8.35455 3 5.23182 5.33636 3.79545 8.51818L6.62727 10.9273C7.42045 8.59091 9.52273 6.99545 12 6.99545V6.27273Z"
      fill="#EA4335"
    />
  </svg>
);


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/'); // Redirect to homepage or dashboard
    } catch (error: any) {
      console.error('Login Error:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please try again.';
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Login Successful',
        description: 'Welcome!',
      });
      router.push('/'); // Redirect to homepage or dashboard
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Google Sign-In Failed',
        description: error.message || 'Could not sign in with Google.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your HealthWise account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </form>
          </Form>

          <div className="my-4 flex items-center before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border">
            <p className="mx-4 text-center text-sm text-muted-foreground">OR</p>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon /> Sign In with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
