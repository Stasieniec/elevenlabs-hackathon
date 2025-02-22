import { LucideIcon, Users, Briefcase, MessageSquare } from 'lucide-react';

export type Situation = {
  id: string;
  title: string;
  description: string;
  objectives: string[];
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  situations: Situation[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  categoryColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  chapters: Chapter[];
};

export const courses: Course[] = [
  {
    id: '1',
    title: 'Small Talk Mastery',
    description: 'Learn to navigate casual conversations with confidence and ease.',
    icon: Users,
    category: 'Social Skills',
    categoryColor: '#F39C12',
    difficulty: 'Beginner',
    duration: '4 weeks',
    chapters: [
      {
        id: '1-1',
        title: 'Introduction to Small Talk',
        description: 'Learn the basics of engaging in casual conversation',
        situations: [
          {
            id: '1-1-1',
            title: 'Office Kitchen Chat',
            description: 'Practice casual conversation with a coworker in the office kitchen',
            objectives: ['Initiate conversation naturally', 'Show interest in the other person', 'End conversation gracefully']
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Professional Negotiations',
    description: 'Master the art of business negotiations and deal-making.',
    icon: Briefcase,
    category: 'Professional',
    categoryColor: '#27AE60',
    difficulty: 'Advanced',
    duration: '6 weeks',
    chapters: [
      {
        id: '2-1',
        title: 'Preparation Fundamentals',
        description: 'Learn how to prepare for negotiations effectively',
        situations: [
          {
            id: '2-1-1',
            title: 'Research Practice',
            description: 'Practice gathering and organizing key information before a negotiation',
            objectives: ['Identify key stakeholders', 'Research market conditions', 'Set clear objectives']
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Interview Excellence',
    description: 'Prepare for job interviews and learn to present yourself effectively.',
    icon: MessageSquare,
    category: 'Career',
    categoryColor: '#2C3E50',
    difficulty: 'Intermediate',
    duration: '3 weeks',
    chapters: [
      {
        id: '3-1',
        title: 'Common Interview Questions',
        description: 'Practice answering frequently asked interview questions',
        situations: [
          {
            id: '3-1-1',
            title: 'Tell Me About Yourself',
            description: 'Master the most common interview opener',
            objectives: ['Structure your response', 'Highlight relevant experience', 'Show personality']
          }
        ]
      }
    ]
  }
]; 