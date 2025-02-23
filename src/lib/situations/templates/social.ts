import { SituationTemplate } from '../../types/situations';

export const socialTemplates: SituationTemplate[] = [
  {
    id: "reject-call-center",
    title: "Rejecting Unwanted Calls",
    description: "Master the art of saying no to persistent callers",
    icon: "phone-off",
    context: "You keep getting calls about {product_service}, which {reason_for_rejection}",
    userGoal: "End the call politely but firmly without {negative_outcome}",
    aiRole: "Persistent {caller_type} who {sales_tactic}",
    category: "social",
    variables: [
      {
        name: "product_service",
        description: "The product or service being offered",
        defaultValue: "extending your car's warranty"
      },
      {
        name: "reason_for_rejection",
        description: "Why you're not interested",
        defaultValue: "you don't even own a car"
      },
      {
        name: "negative_outcome",
        description: "What you want to avoid during the conversation",
        defaultValue: "being rude or losing your temper"
      },
      {
        name: "caller_type",
        description: "The type of sales person calling",
        defaultValue: "telemarketer"
      },
      {
        name: "sales_tactic",
        description: "The tactic the caller uses",
        defaultValue: "has a counter-argument for every objection"
      }
    ]
  },
  {
    id: "end-conversation",
    title: "Ending a Boring Conversation",
    description: "Gracefully exit an endless conversation at a party",
    icon: "door-open",
    context: "You're at a networking event and stuck in a one-sided conversation about cryptocurrency investments. The person has been talking non-stop for 15 minutes, showing no signs of stopping or reading social cues.",
    userGoal: "Find a polite way to end the conversation without being rude or damaging potential professional relationships",
    aiRole: "Enthusiastic crypto investor who loves explaining complex blockchain concepts and doesn't pick up on subtle hints that someone wants to leave the conversation",
    category: "social"
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch",
    description: "Pitch your revolutionary AI-powered toaster",
    icon: "presentation",
    context: "You're in a venture capital firm's office, pitching your startup that puts ChatGPT in a toaster. While the idea might sound absurd, you genuinely believe in its potential to revolutionize breakfast technology.",
    userGoal: "Convince the investor of your vision while maintaining professionalism and handling skeptical questions",
    aiRole: "Seasoned venture capitalist who has seen everything and asks surprisingly practical questions about market size, user acquisition, and toast quality metrics",
    category: "social"
  },
  {
    id: "meeting-parents",
    title: "Meeting Partner's Parents",
    description: "Navigate the delicate first meeting with your partner's family",
    icon: "users",
    context: "You're meeting your partner's traditional parents for the first time at a formal dinner. They have high expectations and strong opinions about their child's choice of partner.",
    userGoal: "Make a positive impression while staying authentic to yourself and navigating potentially sensitive topics",
    aiRole: "Conservative parent who values traditional success metrics (career, education, family background) and subtly probes into your background and intentions",
    category: "social"
  }
]; 