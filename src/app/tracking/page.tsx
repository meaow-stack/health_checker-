
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import SymptomForm from '@/components/tracking/symptom-form';
import SymptomList from '@/components/tracking/symptom-list';
import SymptomCharts from '@/components/tracking/symptom-charts';
import type { SymptomLog } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info, Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LOCAL_STORAGE_KEY = 'healthwise_symptoms';

export default function SymptomTrackingPage() {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<SymptomLog | null>(null);

  // Load symptoms from local storage on component mount
  useEffect(() => {
    const storedSymptoms = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSymptoms) {
      try {
        setSymptoms(JSON.parse(storedSymptoms));
      } catch (error) {
        console.error("Failed to parse symptoms from local storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
  }, []);

  // Save symptoms to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(symptoms));
  }, [symptoms]);

  const addSymptom = (symptom: Omit<SymptomLog, 'id'>) => {
    setSymptoms((prev) => [...prev, { ...symptom, id: Date.now().toString() }]);
    setIsFormOpen(false); // Close dialog after adding
  };

  const updateSymptom = (updatedSymptom: SymptomLog) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === updatedSymptom.id ? updatedSymptom : s))
    );
    setEditingSymptom(null);
    setIsFormOpen(false); // Close dialog after updating
  };

  const deleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (symptom: SymptomLog) => {
    setEditingSymptom(symptom);
    setIsFormOpen(true);
  };
  
  const openAddNewForm = () => {
    setEditingSymptom(null);
    setIsFormOpen(true);
  }

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Symptom Tracking"
        description="Log your symptoms, monitor their intensity, and visualize trends over time."
      >
        <Button onClick={openAddNewForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log New Symptom
        </Button>
      </PageHeader>

      <Alert className="mb-6 border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <AlertTitle className="font-headline text-blue-700 dark:text-blue-300">Track Your Well-being</AlertTitle>
        <AlertDescription>
          Regularly logging your symptoms can help you and your healthcare provider understand patterns and manage your health more effectively. All data is stored locally in your browser.
        </AlertDescription>
      </Alert>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingSymptom ? 'Edit Symptom Log' : 'Log New Symptom'}</DialogTitle>
            <DialogDescription>
              {editingSymptom ? 'Update the details of your symptom.' : 'Fill in the details about the symptom you are experiencing.'}
            </DialogDescription>
          </DialogHeader>
          <SymptomForm 
            onSubmitSymptom={editingSymptom ? updateSymptom : addSymptom} 
            initialData={editingSymptom}
          />
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 md:w-1/2 lg:w-1/3">
          <TabsTrigger value="list">Symptom List</TabsTrigger>
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {symptoms.length > 0 ? (
            <SymptomList symptoms={symptoms} onEdit={handleEdit} onDelete={deleteSymptom} />
          ) : (
            <div className="text-center py-12">
              <Activity className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-headline">No Symptoms Logged Yet</h3>
              <p className="text-muted-foreground mb-4">Start by logging a new symptom to see it appear here.</p>
              <Button onClick={openAddNewForm}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Log Your First Symptom
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="charts">
          {symptoms.length > 0 ? (
             <SymptomCharts symptoms={symptoms} />
          ) : (
            <div className="text-center py-12">
               <Activity className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-headline">Not Enough Data for Charts</h3>
              <p className="text-muted-foreground mb-4">Log some symptoms to see your trends visualized here.</p>
               <Button onClick={openAddNewForm}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Log Symptoms to See Charts
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
