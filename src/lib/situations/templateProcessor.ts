import { SituationTemplate, QuickTrainingSituation, VoiceType } from '../types/situations';

type TemplateVariables = Record<string, string>;

export function processSituationTemplate(
  template: SituationTemplate,
  variables?: TemplateVariables,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
  voice?: VoiceType
): QuickTrainingSituation {
  // Use provided variables or default values
  const processedVars = template.variables?.reduce((acc, variable) => {
    acc[variable.name] = variables?.[variable.name] ?? variable.defaultValue ?? '';
    return acc;
  }, {} as TemplateVariables) ?? {};

  // Replace variables in strings
  const processString = (str: string) => {
    return template.variables 
      ? str.replace(/\{(\w+)\}/g, (_, key) => processedVars[key] || '')
      : str;
  };

  return {
    id: template.id,
    title: template.title,
    description: template.description,
    icon: template.icon,
    context: processString(template.context),
    userGoal: processString(template.userGoal),
    aiRole: processString(template.aiRole),
    category: template.category,
    difficulty,
    voice: voice || template.voice,
    tags: [template.category, difficulty, ...Object.values(processedVars)]
      .map(tag => tag.toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean)
  };
} 