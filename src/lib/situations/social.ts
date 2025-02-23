import { QuickTrainingSituation } from '../types/situations';
import { socialTemplates } from './templates/social';
import { processSituationTemplate } from './templateProcessor';

// Create our first situation from the template
const callCenterSituation = processSituationTemplate(
  socialTemplates[0],
  {
    product_service: "extending your car's warranty",
    reason_for_rejection: "you don't even own a car",
    negative_outcome: "being rude or losing your temper",
    caller_type: "female telemarketer",
    sales_tactic: "has a counter-argument for every objection"
  },
  "easy",
  "female"
);

// All other situations marked as coming soon
const placeholderSituations: QuickTrainingSituation[] = [
  {
    id: "meeting-parents",
    title: "Meeting Partner's Parents",
    description: "Navigate the delicate first meeting with your partner's family",
    icon: "users",
    context: "[Coming Soon] You're meeting your partner's traditional parents for the first time at a formal dinner",
    userGoal: "Make a good impression while staying true to yourself",
    aiRole: "Conservative parent with high expectations and subtle judgment",
    difficulty: "hard",
    category: "social",
    tags: ["family", "relationships", "first-impressions"]
  },
  {
    id: "split-bill",
    title: "Splitting the Bill",
    description: "Handle the awkward moment of dividing the restaurant check",
    icon: "receipt",
    context: "[Coming Soon] You're out with friends, and one person ordered way more expensive items",
    userGoal: "Navigate the situation without damaging friendships",
    aiRole: "Friend who insists on splitting equally despite ordering premium items",
    difficulty: "medium",
    category: "social",
    tags: ["money", "friends", "conflict-resolution"]
  },
  {
    id: "end-conversation",
    title: "Ending a Boring Conversation",
    description: "Gracefully exit an endless conversation at a party",
    icon: "door-open",
    context: "[Coming Soon] You're stuck talking to someone who won't stop discussing their crypto investments",
    userGoal: "End the conversation without being obviously rude",
    aiRole: "Overly enthusiastic crypto evangelist who doesn't pick up on social cues",
    difficulty: "easy",
    category: "social",
    tags: ["conversation", "boundaries", "social-skills"]
  },
  {
    id: "coming-out-liberal",
    title: "Coming Out to Liberal Parents",
    description: "Share your identity with supportive but awkward parents",
    icon: "heart",
    context: "[Coming Soon] Your parents are accepting but might overcompensate with enthusiasm",
    userGoal: "Have an honest conversation while managing their excitement",
    aiRole: "Well-meaning parent who's trying too hard to be supportive",
    difficulty: "easy",
    category: "social",
    tags: ["family", "identity", "communication"]
  },
  {
    id: "coming-out-texas",
    title: "Coming Out in Texas",
    description: "Navigate a challenging conversation about identity",
    icon: "shield",
    context: "[Coming Soon] You're coming out to family members in a conservative environment",
    userGoal: "Express yourself while maintaining safety and boundaries",
    aiRole: "Traditional family member with strong religious views",
    difficulty: "hard",
    category: "social",
    tags: ["family", "identity", "boundaries"]
  },
  {
    id: "vegan-bbq",
    title: "Being Vegan at a BBQ",
    description: "Handle food preferences at a meat-centric gathering",
    icon: "salad",
    context: "[Coming Soon] You're at a Texas BBQ and you're the only vegan",
    userGoal: "Stay true to your values without making others uncomfortable",
    aiRole: "Well-meaning but persistent host who keeps offering you 'just a little bite'",
    difficulty: "medium",
    category: "social",
    tags: ["food", "values", "social-pressure"]
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch",
    description: "Pitch your revolutionary AI-powered toaster",
    icon: "presentation",
    context: "[Coming Soon] You're pitching your startup that puts ChatGPT in a toaster",
    userGoal: "Convince investors with a straight face that this is the next big thing",
    aiRole: "Skeptical investor who asks surprisingly practical questions",
    difficulty: "hard",
    category: "social",
    tags: ["business", "humor", "presentation"]
  },
  {
    id: "job-rejection",
    title: "Handling Job Rejection",
    description: "Maintain professionalism after a disappointing outcome",
    icon: "briefcase-x",
    context: "[Coming Soon] You just got rejected from your dream job after 8 interviews",
    userGoal: "Respond gracefully while keeping future opportunities open",
    aiRole: "HR manager delivering the news with corporate buzzwords",
    difficulty: "medium",
    category: "social",
    tags: ["career", "professionalism", "resilience"]
  },
  {
    id: "nosy-relative",
    title: "Deflecting Personal Questions",
    description: "Handle overly curious relatives at family gatherings",
    icon: "eye-off",
    context: "[Coming Soon] Your aunt won't stop asking about your relationship status and future plans",
    userGoal: "Maintain privacy while keeping the peace at a family dinner",
    aiRole: "Persistent relative who means well but doesn't understand boundaries",
    difficulty: "medium",
    category: "social",
    tags: ["family", "boundaries", "privacy"]
  }
];

export const socialSituations: QuickTrainingSituation[] = [
  callCenterSituation,
  ...placeholderSituations
]; 