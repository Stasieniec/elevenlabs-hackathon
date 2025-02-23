import { Course } from '../types/courses';
import { Shield } from 'lucide-react';
import { processSituationTemplate } from '../situations/templateProcessor';
import { healthSituations } from '../situations/health';

// Placeholder situations for other chapters - to be implemented
const placeholderMentalHealth1 = processSituationTemplate({
  id: "mental-health-1",
  title: "Mental Health Discussion 1",
  description: "Placeholder for first mental health situation",
  icon: "brain",
  context: "Placeholder context",
  userGoal: "Placeholder goal",
  aiRole: "Placeholder role",
  category: "mental-health"
}, undefined, "medium");

const placeholderMentalHealth2 = processSituationTemplate({
  id: "mental-health-2",
  title: "Mental Health Discussion 2",
  description: "Placeholder for second mental health situation",
  icon: "brain",
  context: "Placeholder context",
  userGoal: "Placeholder goal",
  aiRole: "Placeholder role",
  category: "mental-health"
}, undefined, "medium");

const placeholderAwkward1 = processSituationTemplate({
  id: "awkward-1",
  title: "Awkward Situation 1",
  description: "Placeholder for first awkward situation",
  icon: "frown",
  context: "Placeholder context",
  userGoal: "Placeholder goal",
  aiRole: "Placeholder role",
  category: "social"
}, undefined, "medium");

const placeholderAwkward2 = processSituationTemplate({
  id: "awkward-2",
  title: "Awkward Situation 2",
  description: "Placeholder for second awkward situation",
  icon: "frown",
  context: "Placeholder context",
  userGoal: "Placeholder goal",
  aiRole: "Placeholder role",
  category: "social"
}, undefined, "medium");

export const breakingTaboosCourse: Course = {
  id: "breaking-taboos",
  title: "Breaking Taboos: Navigating Sensitive Topics",
  description: "Learn to handle difficult conversations about health, mental wellbeing, and awkward situations with confidence and empathy. Master the art of discussing sensitive topics while maintaining comfort and trust.",
  category: "personal",
  categoryColor: "#9B59B6",
  icon: Shield,
  isEnrollable: true,
  duration: "3-4 hours",
  chapters: [
    {
      id: "mental-wellbeing",
      title: "Mental Wellbeing",
      description: "Learn to navigate conversations about mental health with sensitivity and understanding.",
      situations: [placeholderMentalHealth1, placeholderMentalHealth2],
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
      situations: [placeholderAwkward1, placeholderAwkward2],
      order: 3
    }
  ]
}; 