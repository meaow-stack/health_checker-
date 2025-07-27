
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { symptomChatbot, type SymptomChatbotOutput } from '@/ai/flows/symptom-chatbot';
import { Bot, User, Loader2, Send, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(false);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(SymptomFormSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  // Effect to fetch history when user logs in and consents
  useEffect(() => {
    if (user && saveChatHistory) {
      setHistoryLoading(true);
      setMessages([]); // Clear previous messages before loading new history
      getChatHistory(user.uid)
        .then((history) => {
          setMessages(history);
        })
        .catch((error) => {
          toast({
            title: "Error Loading History",
            description: error instanceof Error ? error.message : "Could not load chat history.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setHistoryLoading(false);
        });
    } else {
      // Clear messages if user logs out or revokes consent
      setMessages([]);
    }
  }, [user, saveChatHistory, toast]);

  const handleSaveMessage = (message: Message) => {
    if (user && saveChatHistory) {
      saveChatMessage(user.uid, message)
        .catch(error => {
            console.error("Failed to save message:", error);
            toast({
                title: "Save Error",
                description: `Could not save message: ${error.message}. Check Firestore rules.`,
                variant: "destructive"
            });
        });
    }
  };


  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: data.symptoms };
    
    // Optimistically update the UI with the user's message
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    // Save the message in the background
    handleSaveMessage(userMessage);

    try {
      const result: SymptomChatbotOutput = await symptomChatbot({ symptoms: data.symptoms });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: result.potentialCauses };
      setMessages(prev => [...prev, aiMessage]);
      handleSaveMessage(aiMessage);

    } catch (error) {
      console.error('Symptom Chatbot Error:', error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', text: "I'm sorry, I encountered an error. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Chatbot Error",
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Symptom Chatbot"
        description="Describe your symptoms and our AI will provide potential insights."
        className="px-6 pt-6 pb-4"
      />
      <Card className="flex flex-col flex-1 mx-6 mb-6 shadow-none border-none bg-transparent">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
           {historyLoading && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2">Loading your chat history...</p>
            </div>
          )}
          {!historyLoading && messages.length === 0 && (
             <Card className="w-full max-w-lg mx-auto mt-10 p-6 text-center shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">HealthWise AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-muted-foreground">
                  Start a conversation by typing your symptoms below. For example: "I have a headache and a slight fever."
                </p>
                 <div className="flex justify-center items-center gap-4">
                     <Link href="/prediction"><Button variant="outline">Disease Predictor</Button></Link>
                     <Link href="/tracking"><Button variant="outline">Symptom Tracker</Button></Link>
                 </div>
              </CardContent>
             </Card>
          )}
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
            {isLoading && messages.length > 0 && (
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
        </ScrollArea>
        <div className="p-4 pt-0 border-t bg-background">
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
                        ref={textareaRef}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || authLoading || (user && historyLoading)}
                        aria-label="Enter your symptoms"
                        rows={1}
                        className="min-h-[48px] resize-none pr-16"
                      />
                    </FormControl>
                     <FormMessage className="absolute bottom-full mb-1" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || authLoading || (user && historyLoading)} className="absolute right-2 top-1/2 -translate-y-1/2" size="icon">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
          </div>
           {user && !authLoading && (
                 <div className="flex items-center space-x-2 mt-3">
                  <Checkbox 
                    id="save-history" 
                    checked={saveChatHistory}
                    onCheckedChange={(checked) => setSaveChatHistory(checked as boolean)}
                  />
                  <Label htmlFor="save-history" className="text-xs font-normal text-muted-foreground leading-snug">
                    Save my chat history for future sessions.
                  </Label>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-3 text-center">
                <AlertTriangle className="inline h-3 w-3 mr-1" />
                This is not a diagnostic tool. Always consult a healthcare professional.
            </p>
        </div>
      </Card>
    </div>
  );
}
