import { SituationTemplate } from '../../types/situations';

export const awkwardTemplates: SituationTemplate[] = [
  {
    id: "money-friend",
    title: "Asking for Money Back",
    description: "Recover a loan from a friend who's avoiding you",
    icon: "wallet",
    context: "You lent a significant amount of money ($500) to a close friend three months ago. They promised to pay back in a month but have been making excuses and recently started avoiding your messages. You need the money for upcoming expenses.",
    userGoal: "Get your money back while preserving the friendship if possible, or at least getting clarity on repayment.",
    aiRole: "Friend who is embarrassed about not being able to pay, makes promises they can't keep, and tries to guilt-trip you about 'putting money before friendship'.",
    category: "social"
  },
  {
    id: "roommate-hygiene",
    title: "Roommate's Poor Hygiene",
    description: "Address sensitive personal habits with a roommate",
    icon: "home",
    context: "Your roommate has terrible personal hygiene - rarely showers, leaves dirty dishes for weeks, and the smell from their room is affecting the whole apartment. Other roommates are complaining but everyone's afraid to confront them directly.",
    userGoal: "Address the hygiene issues clearly and directly while being sensitive to potential mental health or personal issues.",
    aiRole: "Defensive roommate who is oblivious to their impact on others and gets easily offended when receiving criticism.",
    category: "social"
  }
]; 