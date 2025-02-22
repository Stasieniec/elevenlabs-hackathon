import { Course } from './types';

export const courses: Course[] = [
  {
    id: 'trial-course',
    title: 'Trial Course',
    description: 'A showcase of Oratoria\'s capabilities',
    chapters: [
      {
        id: 'introduction',
        title: 'Introduction to Social Interactions',
        description: 'Learn the basics of effective communication',
        orderIndex: 1,
        situations: [
          {
            id: 'first-day-at-work',
            title: 'First Day at Work',
            description: 'Practice introducing yourself to new colleagues',
            context: 'You are starting your first day at a new job. You need to introduce yourself to your team members in a way that is professional yet approachable.',
            orderIndex: 1,
            aiPersona: {
              name: 'Sarah Chen',
              role: 'Team Lead',
              personality: 'Friendly and professional, with a focus on creating a welcoming environment for new team members',
              context: 'Sarah is the team lead who will be introducing you to the team. She wants to make sure you feel comfortable and get to know your colleagues.'
            }
          },
          {
            id: 'coffee-break-chat',
            title: 'Coffee Break Chat',
            description: 'Learn to engage in casual workplace conversations',
            context: 'You are taking a coffee break and encounter a colleague you haven\'t spoken with before. This is a good opportunity for some casual networking.',
            orderIndex: 2,
            aiPersona: {
              name: 'Michael Rodriguez',
              role: 'Senior Developer',
              personality: 'Casual and tech-savvy, enjoys discussing both work and personal interests',
              context: 'Michael is taking his usual afternoon coffee break and is open to chatting with new colleagues.'
            }
          }
        ]
      },
      {
        id: 'difficult-conversations',
        title: 'Handling Difficult Conversations',
        description: 'Master the art of navigating challenging dialogues',
        orderIndex: 2,
        situations: [
          {
            id: 'feedback-session',
            title: 'Receiving Constructive Feedback',
            description: 'Learn how to handle and respond to constructive criticism professionally',
            context: 'Your team lead has scheduled a one-on-one meeting to discuss areas where you could improve your performance.',
            orderIndex: 1,
            aiPersona: {
              name: 'David Thompson',
              role: 'Project Manager',
              personality: 'Direct but empathetic, focused on team growth and development',
              context: 'David needs to provide feedback about your recent project work and communication style.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'small-talk-mastery',
    title: 'Small Talk Mastery',
    description: 'Learn the art of engaging small talk',
    chapters: [
      {
        id: 'basics',
        title: 'Small Talk Basics',
        description: 'Master the fundamentals of engaging conversations',
        orderIndex: 1,
        situations: [
          {
            id: 'weather-starter',
            title: 'Weather as a Conversation Starter',
            description: 'Learn how to use weather as an effective conversation opener',
            context: 'You\'re at a social gathering and want to start a conversation with someone new.',
            orderIndex: 1,
            aiPersona: {
              name: 'Emma Wilson',
              role: 'Fellow Party Guest',
              personality: 'Friendly and outgoing, enjoys meeting new people',
              context: 'Emma is also looking to meet new people at the gathering.'
            }
          }
        ]
      }
    ]
  }
]; 