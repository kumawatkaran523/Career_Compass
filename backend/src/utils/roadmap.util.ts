import { DURATION_TO_WEEKS } from "../types/roadmap.types";

export const calculateWeeksAndHours = (
  duration: string
): { totalWeeks: number; estimatedHours: number } => {
  const totalWeeks = DURATION_TO_WEEKS[duration] || 4;
  const estimatedHours = totalWeeks * 20;
  return { totalWeeks, estimatedHours };
};
