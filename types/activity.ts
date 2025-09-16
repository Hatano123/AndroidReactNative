export interface Activity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  duration: number; // minutes
  timestamp: number; // Unix timestamp
  createdAt: Date;
  updatedAt: Date;
  notes?: string; // Optional notes
}

export interface CreateActivityData {
  date: string;
  startTime: string;
  duration: number;
  notes?: string;
}

export interface UpdateActivityData {
  startTime?: string;
  duration?: number;
  notes?: string;
}

export interface ActivitySummary {
  date: string;
  totalMinutes: number;
  activityCount: number;
  activities: Activity[];
}



