import { QuickTrainingSituation, SituationTemplate } from '../types/situations';
import { professionalSituations } from './professional';
import { socialSituations } from './social';
import { familySituations } from './family';
import { identitySituations } from './identity';
import { funSituations } from './fun';

export const allQuickTrainingSituations: QuickTrainingSituation[] = [
  ...professionalSituations,
  ...socialSituations,
  ...familySituations,
  ...identitySituations,
  ...funSituations,
];

export const situationsByCategory = {
  professional: professionalSituations,
  social: socialSituations,
  family: familySituations,
  identity: identitySituations,
  fun: funSituations,
};

export function getSituationById(id: string): QuickTrainingSituation | undefined {
  return allQuickTrainingSituations.find(s => s.id === id);
}

export function getSituationsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuickTrainingSituation[] {
  return allQuickTrainingSituations.filter(s => s.difficulty === difficulty);
}

export function getSituationsByTags(tags: string[]): QuickTrainingSituation[] {
  return allQuickTrainingSituations.filter(s => 
    tags.some(tag => s.tags.includes(tag.toLowerCase()))
  );
} 