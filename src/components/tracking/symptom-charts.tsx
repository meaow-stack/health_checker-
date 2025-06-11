'use client';

import { useMemo, useState } from 'react';
import type { SymptomLog, SymptomChartDataPoint, SymptomFrequency } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, LabelList } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, LineChartIcon, BarChart3Icon } from 'lucide-react';
import { parseISO, format, differenceInDays } from 'date-fns';

interface SymptomChartsProps {
  symptoms: SymptomLog[];
}

const CHART_COLORS = {
  intensity: "hsl(var(--primary))",
  frequency: "hsl(var(--accent))",
};

export default function SymptomCharts({ symptoms }: SymptomChartsProps) {
  const [selectedSymptomName, setSelectedSymptomName] = useState<string | null>(null);

  const uniqueSymptomNames = useMemo(() => {
    const names = new Set(symptoms.map(s => s.symptomName));
    return Array.from(names);
  }, [symptoms]);

  useEffect(() => {
    if (uniqueSymptomNames.length > 0 && !selectedSymptomName) {
      setSelectedSymptomName(uniqueSymptomNames[0]);
    }
  }, [uniqueSymptomNames, selectedSymptomName]);


  const intensityChartData: SymptomChartDataPoint[] = useMemo(() => {
    if (!selectedSymptomName) return [];
    return symptoms
      .filter(s => s.symptomName === selectedSymptomName)
      .sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .map(s => ({
        date: format(parseISO(s.date), 'MMM dd'),
        intensity: s.intensity,
      }));
  }, [symptoms, selectedSymptomName]);

  const frequencyChartData: SymptomFrequency[] = useMemo(() => {
    const frequencyMap = new Map<string, number>();
    symptoms.forEach(s => {
      frequencyMap.set(s.symptomName, (frequencyMap.get(s.symptomName) || 0) + 1);
    });
    return Array.from(frequencyMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 10); // Show top 10 most frequent
  }, [symptoms]);

  const chartConfig = {
    intensity: { label: 'Intensity', color: CHART_COLORS.intensity, icon: LineChartIcon },
    frequency: { label: 'Frequency', color: CHART_COLORS.frequency, icon: BarChart3Icon },
  };

  if (symptoms.length === 0) {
    return (
      <Card className="text-center py-8 shadow-md">
        <CardContent>
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No data available to display charts. Log some symptoms first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card className="shadow-xl">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-headline">Symptom Intensity Over Time</CardTitle>
          <CardDescription>Intensity (0-10) of the selected symptom.</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          {uniqueSymptomNames.length > 0 ? (
            <Select
              value={selectedSymptomName || undefined}
              onValueChange={(value) => setSelectedSymptomName(value)}
            >
              <SelectTrigger className="w-full md:w-[200px] mb-4">
                <SelectValue placeholder="Select a symptom" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSymptomNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
             <p className="text-muted-foreground text-sm text-center py-4">No symptoms with multiple entries to compare intensity.</p>
          )}

          {selectedSymptomName && intensityChartData.length > 1 ? (
            <ChartContainer config={chartConfig} className="aspect-video h-[300px] w-full">
              <LineChart data={intensityChartData} margin={{ left: 12, right: 12, top: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" labelKey="intensity" />}
                />
                <Line
                  dataKey="intensity"
                  type="monotone"
                  stroke={CHART_COLORS.intensity}
                  strokeWidth={2}
                  dot={{ r: 4, fill: CHART_COLORS.intensity }}
                  activeDot={{ r: 6 }}
                >
                    <LabelList dataKey="intensity" position="top" offset={8} className="fill-foreground text-xs" />
                </Line>
              </LineChart>
            </ChartContainer>
          ) : selectedSymptomName && intensityChartData.length <=1 ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              <AlertCircle className="h-6 w-6 mr-2" />
              Not enough data points for '{selectedSymptomName}' to display intensity trend. Log more entries.
            </div>
          ): !selectedSymptomName ? (
             <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              <AlertCircle className="h-6 w-6 mr-2" />
              Select a symptom to view its intensity trend.
            </div>
          ) : null}
        </CardContent>
         <CardContent className="flex-row border-t p-4 items-center justify-between text-sm text-muted-foreground">
            {selectedSymptomName && intensityChartData.length > 0 && <ChartLegendContent payload={[{value: 'intensity', type: 'line', id: 'intensity', color: CHART_COLORS.intensity }]} config={chartConfig} />}
         </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader className="items-center pb-0">
          <CardTitle className="font-headline">Symptom Frequency</CardTitle>
          <CardDescription>Count of occurrences for each symptom (Top 10).</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          {frequencyChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="aspect-video h-[300px] w-full">
              <BarChart data={frequencyChartData} layout="vertical" margin={{ left: 12, right: 30, top:20, bottom: 5}}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" dataKey="count" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" fill={CHART_COLORS.frequency} radius={4}>
                    <LabelList dataKey="count" position="right" offset={8} className="fill-foreground text-xs" />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
               <AlertCircle className="h-6 w-6 mr-2" />
              No symptoms logged yet to show frequency.
            </div>
          )}
        </CardContent>
         <CardContent className="flex-row border-t p-4 items-center justify-between text-sm text-muted-foreground">
             {frequencyChartData.length > 0 && <ChartLegendContent payload={[{value: 'frequency', type: 'rect', id: 'frequency', color: CHART_COLORS.frequency }]} config={chartConfig} />}
         </CardContent>
      </Card>
    </div>
  );
}

// Custom hook for effect once, for client components using `useEffect` with empty dependency array
// (e.g., to set initial selected symptom name)
// This is not strictly necessary here as useEffect in SymptomCharts already handles it.
// const useEffectOnce = (effect: React.EffectCallback) => {
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(effect, []);
// };
