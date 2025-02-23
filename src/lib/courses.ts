import { LucideIcon, Users, Briefcase, MessageSquare, Heart } from 'lucide-react';

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
  isEnrollable: boolean;
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
    duration: '2 chapters',
    isEnrollable: true,
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
          },
          {
            id: '1-1-2',
            title: 'Coffee Shop Meeting',
            description: 'Practice small talk with someone you just met at a coffee shop',
            objectives: ['Find common interests', 'Keep the conversation flowing', 'Read social cues']
          }
        ]
      },
      {
        id: '1-2',
        title: 'Advanced Small Talk Techniques',
        description: 'Master the art of keeping conversations engaging and meaningful',
        situations: [
          {
            id: '1-2-1',
            title: 'Networking Event',
            description: 'Navigate a professional networking event with confidence',
            objectives: ['Move between conversations smoothly', 'Remember names and details', 'Follow up appropriately']
          },
          {
            id: '1-2-2',
            title: 'Group Discussion',
            description: 'Participate effectively in a group conversation',
            objectives: ['Include everyone in the conversation', 'Balance listening and speaking', 'Add value to the discussion']
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
    duration: '3 chapters',
    isEnrollable: false,
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
    duration: '2 chapters',
    isEnrollable: false,
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
  },
  {
    id: '4',
    title: 'Navigating Sensitive Topics',
    description: 'Learn how to discuss health, mental well-being, and other sensitive subjects with empathy and respect.',
    icon: Heart,
    category: 'Social Skills',
    categoryColor: '#F39C12',
    difficulty: 'Intermediate',
    duration: '3 chapters',
    isEnrollable: false,
    chapters: [
      {
        id: '4-1',
        title: 'Discussing Physical Health',
        description: 'Learn to navigate conversations about health conditions and medical challenges',
        situations: [
          {
            id: '4-1-1',
            title: 'Supporting a Friend',
            description: 'Practice having a supportive conversation with a friend about their health condition',
            objectives: ['Show empathy and understanding', 'Respect privacy boundaries', 'Offer appropriate support']
          },
          {
            id: '4-1-2',
            title: 'Workplace Disclosure',
            description: 'Navigate discussing health needs with your supervisor',
            objectives: ['Maintain professionalism', 'Communicate needs clearly', 'Set appropriate boundaries']
          }
        ]
      },
      {
        id: '4-2',
        title: 'Mental Health Conversations',
        description: 'Develop skills for discussing mental health with sensitivity',
        situations: [
          {
            id: '4-2-1',
            title: 'Supporting Mental Health',
            description: 'Learn to have supportive conversations about mental health challenges',
            objectives: ['Create a safe space', 'Use appropriate language', 'Know when to suggest professional help']
          },
          {
            id: '4-2-2',
            title: 'Work-Life Balance',
            description: 'Discuss mental well-being and stress management at work',
            objectives: ['Address burnout professionally', 'Negotiate boundaries', 'Maintain workplace relationships']
          }
        ]
      },
      {
        id: '4-3',
        title: 'Awkward Situations',
        description: 'Handle uncomfortable social situations with grace',
        situations: [
          {
            id: '4-3-1',
            title: 'Addressing Misunderstandings',
            description: 'Navigate and resolve social misunderstandings',
            objectives: ['Address issues directly', 'De-escalate tension', 'Rebuild trust']
          },
          {
            id: '4-3-2',
            title: 'Setting Boundaries',
            description: 'Practice setting and maintaining personal boundaries',
            objectives: ['Communicate boundaries clearly', 'Handle pushback gracefully', 'Maintain relationships']
          }
        ]
      }
    ]
  }
]; 