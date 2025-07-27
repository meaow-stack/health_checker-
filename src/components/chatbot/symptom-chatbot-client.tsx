
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { symptomChatbot, type SymptomChatbotOutput } from '@/ai/flows/symptom-chatbot';
import { Bot, User, Loader2, BotMessageSquare, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/hooks/use-auth';
import { saveChatMessage, getChatHistory } from '@/services/chatHistoryService';
import type { Message } from '@/types';


const SymptomFormSchema = z.object({
  symptoms: z.string().min(5, { message: 'Please describe your symptoms in at least 5 characters.' }),
});

type SymptomFormValues = z.infer<typeof SymptomFormSchema>;

export default function SymptomChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(SymptomFormSchema),
    defaultValues: {
      symptoms: '',
    },
  });
  
  const fetchHistory = useCallback(async () => {
    if (user && saveChatHistory && !historyLoaded) {
      setIsLoading(true);
      try {
        const history = await getChatHistory(user.uid);
        setMessages(history);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load chat history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setHistoryLoaded(true);
      }
    } else {
        setHistoryLoaded(true);
    }
  }, [user, saveChatHistory, historyLoaded, toast]);
  
  // Effect to handle fetching history when consent changes or user logs in.
  useEffect(() => {
    // If there's no user, or if auth is still loading, do nothing.
    if (!user || authLoading) {
      setHistoryLoaded(false); // Reset history loaded state if user logs out
      setMessages([]); // Clear messages on logout
      return;
    };
    
    // If user is present and gives consent, fetch history.
    if (saveChatHistory) {
      fetchHistory();
    } else {
      // If consent is revoked, clear the messages and reset history loaded state
      setMessages([]);
      setHistoryLoaded(false);
    }
  }, [user, saveChatHistory, authLoading, fetchHistory]);


  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: data.symptoms };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    // Persist user message if logged in and consent is given
    if (user && saveChatHistory) {
      await saveChatMessage(user.uid, userMessage);
    }

    try {
      const result: SymptomChatbotOutput = await symptomChatbot({ symptoms: data.symptoms });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: result.potentialCauses };
      setMessages((prev) => [...prev, aiMessage]);

       // Persist AI message if logged in and consent is given
      if (user && saveChatHistory) {
        await saveChatMessage(user.uid, aiMessage);
      }

    } catch (error) {
      console.error('Symptom Chatbot Error:', error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: "I'm sorry, I encountered an error. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: "Failed to get a response from the chatbot. Please check your connection or try again.",
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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-center">Chat with HealthWise AI</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full p-4 border rounded-md mb-4 bg-muted/20" ref={scrollAreaRef}>
          {(!historyLoaded && saveChatHistory) && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2">Loading your chat history...</p>
            </div>
          )}
          {historyLoaded && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
              <Bot size={48} className="mb-2" />
              <p>No messages yet. Start by typing your symptoms below.</p>
              {user && !saveChatHistory && <p className="text-xs mt-1">(Check the box below to save and view your conversation history.)</p>}
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={`${msg.id}-${index}`}
              className={`flex items-start gap-3 my-3 ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.type === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.type === 'user' && (
                 <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-accent text-accent-foreground"><User size={18}/></AvatarFallback>
                 </Avatar>
              )}
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex items-start gap-3 my-3 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                </Avatar>
              <div className="max-w-[70%] p-3 rounded-lg shadow bg-card text-card-foreground border">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </ScrollArea>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your Symptoms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., I have a headache and a slight fever..."
                      {...field}
                      disabled={isLoading || authLoading || (!!user && !historyLoaded)}
                      aria-label="Enter your symptoms"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {user && (
                 <div className="flex items-center space-x-2 my-4 p-3 border rounded-md bg-background">
                  <Checkbox 
                    id="save-history" 
                    checked={saveChatHistory}
                    onCheckedChange={(checked) => setSaveChatHistory(checked as boolean)}
                  />
                  <Label htmlFor="save-history" className="text-sm font-normal text-muted-foreground leading-snug">
                    Save my chat history for future sessions.
                  </Label>
                  <ShieldCheck className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-auto" />
                </div>
            )}
            <Button type="submit" disabled={isLoading || authLoading || (!!user && !historyLoaded)} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BotMessageSquare className="mr-2 h-4 w-4" />}
              Send Symptoms
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
