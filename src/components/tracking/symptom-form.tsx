'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import type { SymptomLog } from '@/types';
import { Slider } from '@/components/ui/slider';
import { DialogFooter, DialogClose } from '@/components/ui/dialog'; // For close button

const SymptomFormSchema = z.object({
  symptomName: z.string().min(2, { message: 'Symptom name must be at least 2 characters.' }),
  date: z.date({ required_error: 'Date is required.' }),
  time: z.string().optional(),
  intensity: z.number().min(0).max(10),
  notes: z.string().optional(),
  triggers: z.string().optional(), // Storing as comma-separated string for simplicity
  reliefMeasures: z.string().optional(), // Storing as comma-separated string
});

type SymptomFormValues = {
  symptomName: string;
  date: Date;
  time?: string;
  intensity: number;
  notes?: string;
  triggers?: string;
  reliefMeasures?: string;
};

interface SymptomFormProps {
  onSubmitSymptom: (symptom: SymptomLog | Omit<SymptomLog, 'id'>) => void;
  initialData?: SymptomLog | null;
}

export default function SymptomForm({ onSubmitSymptom, initialData }: SymptomFormProps) {
  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(SymptomFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: parseISO(initialData.date), // Convert ISO string back to Date object
          intensity: initialData.intensity || 5, // Default intensity if not set
          triggers: initialData.triggers?.join(', '),
          reliefMeasures: initialData.reliefMeasures?.join(', '),
        }
      : {
          symptomName: '',
          date: new Date(),
          time: format(new Date(), 'HH:mm'),
          intensity: 5,
          notes: '',
          triggers: '',
          reliefMeasures: '',
        },
  });

  const handleSubmit: SubmitHandler<SymptomFormValues> = (data) => {
    const symptomData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'), // Format date to ISO string for storage
      triggers: data.triggers?.split(',').map(t => t.trim()).filter(Boolean),
      reliefMeasures: data.reliefMeasures?.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (initialData?.id) {
      onSubmitSymptom({ ...symptomData, id: initialData.id });
    } else {
      onSubmitSymptom(symptomData);
    }
    form.reset(initialData ? { ...initialData, date: parseISO(initialData.date) } : { symptomName: '', date: new Date(), intensity: 5, notes: '' }); // Reset form after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="symptomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptom Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Headache, Nausea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                        )}
                        >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        

        <FormField
          control={form.control}
          name="intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional details, e.g., what you were doing, specific location of pain." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="triggers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Possible Triggers (Optional, comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Stress, Certain foods, Lack of sleep" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reliefMeasures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relief Measures (Optional, comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rest, Medication, Hydration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {initialData ? 'Save Changes' : 'Add Symptom'}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
