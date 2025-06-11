'use client';

import type { SymptomLog } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CalendarDays, Clock, ThermometerSnowflake, FileText, Zap, ShieldPlus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface SymptomListProps {
  symptoms: SymptomLog[];
  onEdit: (symptom: SymptomLog) => void;
  onDelete: (id: string) => void;
}

export default function SymptomList({ symptoms, onEdit, onDelete }: SymptomListProps) {
  if (symptoms.length === 0) {
    return (
      <Card className="text-center py-8 shadow-md">
        <CardContent>
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No symptoms logged yet. Add a symptom to start tracking.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedSymptoms = [...symptoms].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline">Your Symptom Log</CardTitle>
        <CardDescription>A record of your logged symptoms, most recent first.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] md:h-auto md:max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symptom</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Intensity</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSymptoms.map((symptom) => (
                <TableRow key={symptom.id}>
                  <TableCell className="font-medium">{symptom.symptomName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4"/>
                        {format(parseISO(symptom.date), 'MMM dd, yyyy')}
                        {symptom.time && <><Clock className="h-4 w-4 ml-2"/> {symptom.time}</>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={symptom.intensity > 7 ? "destructive" : symptom.intensity > 4 ? "secondary" : "default"} className="text-xs">
                      {symptom.intensity}/10
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {symptom.notes || <span className="text-muted-foreground/70">No notes</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(symptom)} className="mr-2 hover:text-primary">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the symptom log for "{symptom.symptomName}" on {format(parseISO(symptom.date), 'MMM dd, yyyy')}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(symptom.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
