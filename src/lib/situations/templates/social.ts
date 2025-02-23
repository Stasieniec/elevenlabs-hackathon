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
  }
]; 