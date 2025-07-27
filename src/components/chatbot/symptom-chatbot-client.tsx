
'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { symptomChatbot } from '@/ai/flows/symptom-chatbot';
import { Bot, User, Loader2, Send, AlertTriangle, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { saveChatMessage, getChatHistory } from '@/services/chatHistoryService';
import type { Message } from '@/types';
import Link from 'next/link';
import { PageHeader } from '../common/page-header';

const SymptomFormSchema = z.object({
  symptoms: z.string().min(3, { message: 'Please describe your symptoms in at least 3 characters.' }),
});

type SymptomFormValues = z.infer<typeof SymptomFormSchema>;

export default function SymptomChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(SymptomFormSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  // Effect to fetch history when user is logged in
  useEffect(() => {
    if (user) {
      setHistoryLoading(true);
      getChatHistory(user.uid)
        .then((history) => {
          setMessages(history);
        })
        .catch((error) => {
          console.error("Error loading history:", error);
          toast({
            title: "Error Loading History",
            description: "Could not load your previous chat history. Please try again later.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setHistoryLoading(false);
        });
    } else if (!authLoading) {
      setMessages([]); 
      setHistoryLoading(false);
    }
  }, [user, authLoading, toast]);


  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: data.symptoms };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    // Save user message in the background
    if (user) {
       saveChatMessage(user.uid, userMessage).catch(error => {
            console.error("Failed to save user message:", error);
            toast({
                title: "Save Error",
                description: `Could not save your message: ${error.message}.`,
                variant: "destructive"
            });
       });
    }

    try {
      const result = await symptomChatbot({ symptoms: data.symptoms });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: result.potentialCauses };
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message in the background
      if (user) {
        saveChatMessage(user.uid, aiMessage).catch(error => {
            console.error("Failed to save AI message:", error);
            toast({
                title: "Save Error",
                description: `Could not save the bot's response: ${error.message}.`,
                variant: "destructive"
            });
        });
      }

    } catch (error) {
      console.error('Symptom Chatbot Error:', error);
      const errorMessageText = error instanceof Error && error.message.includes('429')
        ? "I'm sorry, I'm a bit overwhelmed with requests right now. Please try again in a moment."
        : "I'm sorry, I encountered an error. Please try again later.";
      
      const errorMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: errorMessageText };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Chatbot Error",
        description: error instanceof Error ? error.message : "Failed to get a response from the chatbot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };
  
  const isReady = !authLoading;

  const renderChatContent = () => {
    if (historyLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-2">Loading Chat History...</p>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <Card className="w-full max-w-lg mx-auto mt-10 p-6 text-center shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">HealthWise AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <p className="text-muted-foreground">
              Hello! I'm your friendly AI health assistant. How are you feeling today? You can tell me about your symptoms. For example: "I have a headache and a slight fever."
            </p>
            <div className="flex justify-center items-center gap-4">
                <Link href="/prediction"><Button variant="outline">Predict a Disease</Button></Link>
                <Link href="/tracking"><Button variant="outline">Track Symptoms</Button></Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
       <div className="space-y-6">
        {messages.map((msg, index) => (
          <div
            key={`${msg.id}-${index}`}
            className={`flex items-start gap-4 ${
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.type === 'ai' && (
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-card text-card-foreground border rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.type === 'user' && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-accent text-accent-foreground"><User size={20}/></AvatarFallback>
                </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 justify-start">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
              </Avatar>
            <div className="max-w-[75%] p-3 rounded-2xl shadow-md bg-card text-card-foreground border rounded-bl-none">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Symptom Chatbot"
        description="Describe your symptoms and our AI will provide potential insights."
        className="px-6 pt-6 pb-4"
      />
      <Card className="flex flex-col flex-1 mx-6 mb-6 shadow-none border-none bg-transparent">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {renderChatContent()}
        </ScrollArea>
        <div className="p-4 pt-0 border-t bg-background">
          {!user && !authLoading && (
            <Card className="mb-3 bg-secondary/50 border-secondary">
              <CardContent className="p-3 flex items-center justify-center text-center gap-4">
                <p className="text-sm text-secondary-foreground">
                  <Link href="/auth/login" className="font-bold underline">Log in</Link> or <Link href="/auth/signup" className="font-bold underline">sign up</Link> to save your chat history.
                </p>
                <div className="flex gap-2">
                   <Link href="/auth/login"><Button size="sm"><LogIn className="mr-2 h-4 w-4"/>Login</Button></Link>
                   <Link href="/auth/signup"><Button size="sm" variant="outline"><UserPlus className="mr-2 h-4 w-4"/>Sign Up</Button></Link>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a headache and a slight fever..."
                        {...field}
                        onKeyDown={handleKeyDown}
                        disabled={!isReady || isLoading || historyLoading}
                        aria-label="Enter your symptoms"
                        rows={1}
                        className="min-h-[48px] resize-none pr-16"
                      />
                    </FormControl>
                      <FormMessage className="absolute bottom-full mb-1" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isReady || isLoading || historyLoading} className="absolute right-2 top-1/2 -translate-y-1/2" size="icon">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
          </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
                <AlertTriangle className="inline h-3 w-3 mr-1" />
                This is not a diagnostic tool. Always consult a healthcare professional.
            </p>
        </div>
      </Card>
    </div>
  );
}
