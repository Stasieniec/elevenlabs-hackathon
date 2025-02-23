import { SituationTemplate } from '../../types/situations';

export const mentalTemplates: SituationTemplate[] = [
  {
    id: "burnout-boss",
    title: "Discussing Burnout with Your Boss",
    description: "Open up about mental health struggles at work",
    icon: "brain",
    context: "You've been experiencing severe burnout, affecting your work performance. You've been making mistakes, missing deadlines, and your anxiety is through the roof. Your boss has noticed the decline but doesn't know the real reason.",
    userGoal: "Communicate your mental health challenges professionally while setting clear boundaries and proposing solutions.",
    aiRole: "Results-oriented manager who cares about team wellbeing but is primarily focused on deliverables and team performance.",
    category: "mental-health"
  },
  {
    id: "depression-friend",
    title: "Supporting a Friend with Depression",
    description: "Navigate a difficult conversation about depression",
    icon: "heart",
    context: "Your close friend has been isolating themselves for weeks, missing social events, and posting concerning things on social media. You've noticed signs of severe depression but they tend to deflect with humor or change the subject when anyone shows concern.",
    userGoal: "Express your concern and offer support without being pushy or making them feel judged.",
    aiRole: "Friend who uses humor as a defense mechanism, downplays their struggles, and is resistant to seeking help.",
    category: "mental-health"
  }
]; 