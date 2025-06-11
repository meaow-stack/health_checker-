export interface SymptomLog {
  id: string; // Unique identifier for the log entry
  symptomName: string; // Name of the symptom, e.g., "Headache", "Fatigue"
  date: string; // ISO string format for date, e.g., "2024-07-15"
  time?: string; // Optional: HH:MM format, e.g., "14:30"
  intensity: number; // A numerical value, e.g., 1-10 scale
  notes?: string; // Optional additional notes or context
  triggers?: string[]; // Optional: e.g., ["Stress", "Lack of sleep"]
  reliefMeasures?: string[]; // Optional: e.g., ["Painkiller", "Rest"]
}

// Example for chart data structure
export interface SymptomChartDataPoint {
  date: string; // For x-axis, typically date
  intensity?: number; // For y-axis
  [key: string]: any; // Allow other properties for different chart types
}

export interface SymptomFrequency {
  name: string;
  count: number;
}

export interface Doctor {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  rating?: number;
  isOpen?: boolean | string; // Can be boolean or string like "UNKNOWN"
  phoneNumber?: string;
  website?: string;
}
