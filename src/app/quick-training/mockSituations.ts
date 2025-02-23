export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuickTrainingSituation {
  id: string;
  title: string;
  description: string;
  icon: string;
  context: string;
  userGoal: string;
  aiRole: string;
  difficulty: Difficulty;
}

export const mockSituations: QuickTrainingSituation[] = [
  {
    id: "reject-call-center",
    title: "Rejecting Call Center Offers",
    description: "Master the art of saying no to persistent telemarketers",
    icon: "phone-off",
    context: "You keep getting calls about extending your car's warranty (you don't even own a car)",
    userGoal: "Politely but firmly end the conversation without being rude",
    aiRole: "Overly persistent telemarketer who has an answer for everything",
    difficulty: "easy"
  },
  {
    id: "meeting-parents",
    title: "Meeting Partner's Parents",
    description: "Navigate the delicate first meeting with your partner's family",
    icon: "users",
    context: "You're meeting your partner's traditional parents for the first time at a formal dinner",
    userGoal: "Make a good impression while staying true to yourself",
    aiRole: "Conservative parent with high expectations and subtle judgment",
    difficulty: "hard"
  },
  {
    id: "split-bill",
    title: "Splitting the Bill",
    description: "Handle the awkward moment of dividing the restaurant check",
    icon: "receipt",
    context: "You're out with friends, and one person ordered way more expensive items",
    userGoal: "Navigate the situation without damaging friendships",
    aiRole: "Friend who insists on splitting equally despite ordering premium items",
    difficulty: "medium"
  },
  {
    id: "end-conversation",
    title: "Ending a Boring Conversation",
    description: "Gracefully exit an endless conversation at a party",
    icon: "door-open",
    context: "You're stuck talking to someone who won't stop discussing their crypto investments",
    userGoal: "End the conversation without being obviously rude",
    aiRole: "Overly enthusiastic crypto evangelist who doesn't pick up on social cues",
    difficulty: "easy"
  },
  {
    id: "coming-out-liberal",
    title: "Coming Out to Liberal Parents",
    description: "Share your identity with supportive but awkward parents",
    icon: "heart",
    context: "Your parents are accepting but might overcompensate with enthusiasm",
    userGoal: "Have an honest conversation while managing their excitement",
    aiRole: "Well-meaning parent who's trying too hard to be supportive",
    difficulty: "easy"
  },
  {
    id: "coming-out-texas",
    title: "Coming Out in Texas",
    description: "Navigate a challenging conversation about identity",
    icon: "shield",
    context: "You're coming out to family members in a conservative environment",
    userGoal: "Express yourself while maintaining safety and boundaries",
    aiRole: "Traditional family member with strong religious views",
    difficulty: "hard"
  },
  {
    id: "vegan-bbq",
    title: "Being Vegan at a BBQ",
    description: "Handle food preferences at a meat-centric gathering",
    icon: "salad",
    context: "You're at a Texas BBQ and you're the only vegan",
    userGoal: "Stay true to your values without making others uncomfortable",
    aiRole: "Well-meaning but persistent host who keeps offering you 'just a little bite'",
    difficulty: "medium"
  },
  {
    id: "nosy-relative",
    title: "Deflecting Personal Questions",
    description: "Handle overly curious relatives at family gatherings",
    icon: "eye-off",
    context: "Your aunt won't stop asking about your relationship status and future plans",
    userGoal: "Maintain privacy while keeping the peace at a family dinner",
    aiRole: "Persistent relative who means well but doesn't understand boundaries",
    difficulty: "medium"
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch",
    description: "Pitch your revolutionary AI-powered toaster",
    icon: "presentation",
    context: "You're pitching your startup that puts ChatGPT in a toaster",
    userGoal: "Convince investors with a straight face that this is the next big thing",
    aiRole: "Skeptical investor who asks surprisingly practical questions",
    difficulty: "hard"
  },
  {
    id: "job-rejection",
    title: "Handling Job Rejection",
    description: "Maintain professionalism after a disappointing outcome",
    icon: "briefcase-x",
    context: "You just got rejected from your dream job after 8 interviews",
    userGoal: "Respond gracefully while keeping future opportunities open",
    aiRole: "HR manager delivering the news with corporate buzzwords",
    difficulty: "medium"
  }
]; 