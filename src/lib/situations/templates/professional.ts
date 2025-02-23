import { SituationTemplate } from '../../types/situations';

export const professionalTemplates: SituationTemplate[] = [
  {
    id: "job-interview",
    title: "Job Interview Practice",
    description: "Practice for a job interview in your field",
    icon: "briefcase",
    context: "You have an upcoming job interview for a {role} position at {company}",
    userGoal: "Make a strong impression and effectively communicate your {years} years of experience in {field}",
    aiRole: "Experienced interviewer from {company} looking to assess your fit for the {role} role",
    category: "professional",
    variables: [
      {
        name: "role",
        description: "The job title you're interviewing for",
        defaultValue: "Software Engineer"
      },
      {
        name: "company",
        description: "The company you're interviewing with",
        defaultValue: "Tech Corp"
      },
      {
        name: "years",
        description: "Your years of experience",
        defaultValue: "3"
      },
      {
        name: "field",
        description: "Your field of expertise",
        defaultValue: "web development"
      }
    ]
  },
  {
    id: "salary-negotiation",
    title: "Salary Negotiation",
    description: "Practice negotiating your compensation package",
    icon: "trending-up",
    context: "You've received an offer for {role} at {company} with a base salary of {offered_salary}, but you believe you're worth {target_salary}",
    userGoal: "Negotiate for your target salary while maintaining a positive relationship",
    aiRole: "HR representative who has some flexibility but needs strong justification for any increases",
    category: "professional",
    variables: [
      {
        name: "role",
        description: "The job title you're negotiating for",
        defaultValue: "Senior Developer"
      },
      {
        name: "company",
        description: "The company you're negotiating with",
        defaultValue: "Tech Corp"
      },
      {
        name: "offered_salary",
        description: "The salary they offered",
        defaultValue: "$120,000"
      },
      {
        name: "target_salary",
        description: "Your target salary",
        defaultValue: "$140,000"
      }
    ]
  }
]; 