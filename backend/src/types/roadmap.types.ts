export interface RoadmapRequest {
  technology: string;
  duration: string;
  difficulty: string;
  userId?: string;
}

export interface Topic {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'practice' | 'project';
  resources: string[];
}

export interface Week {
  weekNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  topics: Topic[];
}

export interface Roadmap {
  technology: string;
  duration: string;
  difficulty: string;
  totalWeeks: number;
  estimatedHours: number;
  weeks: Week[];
}

export interface SaveRoadmapRequest {
  userId: string;
  technology: string;
  duration: string;
  difficulty: string;
  roadmapData: Roadmap;
}

export interface ProgressUpdate {
  userId: string;
  roadmapId: string;
  topicId: string;
  completed: boolean;
}

export const DURATION_TO_WEEKS: Record<string, number> = {
  "1 Week": 1,
  "2 Weeks": 2,
  "1 Month": 4,
  "3 Months": 12,
  "6 Months": 24,
};