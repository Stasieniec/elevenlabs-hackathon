import { Course } from '../types/courses';
import { Shield } from 'lucide-react';
import { processSituationTemplate } from '../situations/templateProcessor';

// Chapter 1: Identity and Coming Out
const comingOutLiberal = processSituationTemplate({
  id: "coming-out-liberal",
  title: "Coming Out to Liberal Parents",
  description: "Share your identity with supportive but awkward parents",
  icon: "heart",
  context: "Your parents are accepting and progressive, but they might overcompensate with enthusiasm and make the conversation more awkward than it needs to be.",
  userGoal: "Have an honest conversation while managing their excitement and setting comfortable boundaries",
  aiRole: "Well-meaning parent who's trying too hard to be supportive and keeps bringing up LGBTQ+ celebrities and media",
  category: "social"
}, undefined, "easy");

const comingOutConservative = processSituationTemplate({
  id: "coming-out-texas",
  title: "Coming Out in Texas",
  description: "Navigate a challenging conversation about identity",
  icon: "shield",
  context: "You're coming out to your traditional family members in a conservative environment. They have strong religious views but you also know they love you.",
  userGoal: "Express yourself authentically while maintaining safety and setting clear boundaries",
  aiRole: "Traditional family member who initially responds with religious concerns but is capable of listening",
  category: "social"
}, undefined, "hard");

// Chapter 2: Values and Beliefs
const veganBBQ = processSituationTemplate({
  id: "vegan-bbq",
  title: "Being Vegan at a BBQ",
  description: "Handle food preferences at a meat-centric gathering",
  icon: "salad",
  context: "You're at a Texas BBQ and you're the only vegan. The host keeps insisting you try their famous brisket, not understanding your ethical stance.",
  userGoal: "Stay true to your values without creating conflict or making others defensive",
  aiRole: "Well-meaning but persistent host who keeps offering meat dishes and asking about protein intake",
  category: "social"
}, undefined, "medium");

const politicalDinner = processSituationTemplate({
  id: "political-dinner",
  title: "Political Differences at Dinner",
  description: "Navigate political discussions with family",
  icon: "users",
  context: "During a family dinner, the conversation turns to a controversial political topic where you strongly disagree with your relatives' views.",
  userGoal: "Express your perspective respectfully while maintaining family harmony",
  aiRole: "Opinionated relative who holds opposing political views but values family relationships",
  category: "social"
}, undefined, "hard");

// Chapter 3: Personal Boundaries
const nosyRelative = processSituationTemplate({
  id: "nosy-relative",
  title: "Deflecting Personal Questions",
  description: "Handle overly curious relatives at family gatherings",
  icon: "eye-off",
  context: "At a family gathering, your aunt won't stop asking about your relationship status, career choices, and future plans.",
  userGoal: "Maintain your privacy while keeping the peace at the family dinner",
  aiRole: "Persistent relative who means well but doesn't understand personal boundaries",
  category: "social"
}, undefined, "medium");

const salaryDiscussion = processSituationTemplate({
  id: "salary-discussion",
  title: "Discussing Salary with Coworkers",
  description: "Navigate compensation transparency",
  icon: "dollar-sign",
  context: "Your coworkers are discussing salaries openly, and you're asked to share yours in a culture where this is traditionally taboo.",
  userGoal: "Handle the situation professionally while maintaining workplace relationships",
  aiRole: "Curious colleague who believes in salary transparency but might not handle differences well",
  category: "social"
}, undefined, "medium");

export const breakingTaboosCourse: Course = {
  id: "breaking-taboos",
  title: "Breaking Taboos: Navigating Sensitive Topics",
  description: "Master the art of handling challenging conversations about identity, values, and personal boundaries. Learn to express yourself authentically while maintaining relationships.",
  category: "personal",
  categoryColor: "#9B59B6",
  icon: Shield,
  isEnrollable: true,
  duration: "3-4 hours",
  chapters: [
    {
      id: "identity",
      title: "Identity and Coming Out",
      description: "Learn to navigate conversations about personal identity with different types of family members.",
      situations: [comingOutLiberal, comingOutConservative],
      order: 1
    },
    {
      id: "values",
      title: "Values and Beliefs",
      description: "Practice discussing deeply held personal values and beliefs in potentially challenging situations.",
      situations: [veganBBQ, politicalDinner],
      order: 2
    },
    {
      id: "boundaries",
      title: "Personal Boundaries",
      description: "Master the art of setting and maintaining personal boundaries in various social contexts.",
      situations: [nosyRelative, salaryDiscussion],
      order: 3
    }
  ]
}; 