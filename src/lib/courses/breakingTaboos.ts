import { Course } from '../types/courses';
import { Shield } from 'lucide-react';
import { healthSituations } from '../situations/health';
import { mentalSituations } from '../situations/mental';
import { awkwardSituations } from '../situations/awkward';

export const breakingTaboosCourse: Course = {
  id: "breaking-taboos",
  title: "Breaking Taboos: Navigating Sensitive Topics",
  description: "Learn to handle difficult conversations about health, mental wellbeing, and awkward situations with confidence and empathy. Master the art of discussing sensitive topics while maintaining comfort and trust.",
  category: "personal",
  categoryColor: "#9B59B6",
  icon: Shield,
  isEnrollable: true,
  chapters: [
    {
      id: "mental-wellbeing",
      title: "Mental Wellbeing",
      description: "Learn to navigate conversations about mental health with sensitivity and understanding.",
      situations: mentalSituations,
      order: 1
    },
    {
      id: "health",
      title: "Health",
      description: "Master the art of discussing sensitive health topics, whether you're sharing or receiving information.",
      situations: healthSituations,
      order: 2
    },
    {
      id: "awkward-problems",
      title: "Awkward Problems",
      description: "Handle uncomfortable social situations with grace and confidence.",
      situations: awkwardSituations,
      order: 3
    }
  ]
}; 