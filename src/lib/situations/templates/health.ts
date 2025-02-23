import { SituationTemplate } from '../../types/situations';

export const healthTemplates: SituationTemplate[] = [
  {
    id: "doctor-visit",
    title: "Doctor's Visit",
    description: "Navigate a sensitive medical appointment with confidence",
    icon: "stethoscope",
    context: "You have a doctor's appointment to discuss a skin condition in an intimate area. You've been putting off this visit due to embarrassment, but the condition isn't improving with over-the-counter treatments.",
    userGoal: "Overcome your embarrassment to clearly communicate your symptoms and concerns, being specific enough for proper diagnosis while maintaining your composure.",
    aiRole: "Professional doctor who needs detailed information but understands patient sensitivity. Will guide the conversation with direct but gentle questions.",
    category: "health"
  },
  {
    id: "chronic-pain",
    title: "Discussing Chronic Pain",
    description: "Effectively communicate ongoing health issues to medical professionals",
    icon: "heart",
    context: "You've been experiencing persistent back pain that's affecting your daily life and work. Previous doctors have been dismissive, suggesting it's just stress, but you know something's wrong.",
    userGoal: "Advocate for yourself by clearly describing your symptoms, their impact on your life, and why you believe this needs further investigation.",
    aiRole: "New doctor who is thorough but initially skeptical, requiring clear and specific information to understand the severity and nature of your condition.",
    category: "health"
  }
]; 