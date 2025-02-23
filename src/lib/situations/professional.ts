import { QuickTrainingSituation } from '../types/situations';

export const professionalSituations: QuickTrainingSituation[] = [
  {
    id: "job-rejection",
    title: "Handling Job Rejection",
    description: "Maintain professionalism after a disappointing outcome",
    icon: "briefcase-x",
    context: "You just got rejected from your dream job after 8 interviews",
    userGoal: "Respond gracefully while keeping future opportunities open",
    aiRole: "HR manager delivering the news with corporate buzzwords",
    difficulty: "medium",
    category: "professional",
    tags: ["job-search", "rejection", "professionalism", "career"]
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch",
    description: "Pitch your revolutionary AI-powered toaster",
    icon: "presentation",
    context: "You're pitching your startup that puts ChatGPT in a toaster",
    userGoal: "Convince investors with a straight face that this is the next big thing",
    aiRole: "Skeptical investor who asks surprisingly practical questions",
    difficulty: "hard",
    category: "professional",
    tags: ["startup", "pitch", "presentation", "business", "fun"]
  }
]; 