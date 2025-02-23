import { QuickTrainingSituation, Difficulty } from '../types/situations';
import { socialSituations } from '@/lib/situations/social';
import { healthSituations } from '@/lib/situations/health';

// For now, we only have social situations implemented
const emptySituations: QuickTrainingSituation[] = [];

// Combine all situation types
export const allQuickTrainingSituations = [
  ...socialSituations,
  ...healthSituations
];

export const situationsByCategory = {
  professional: emptySituations,
  social: socialSituations,
  family: emptySituations,
  identity: emptySituations,
  fun: emptySituations,
};

export function getSituationById(id: string): QuickTrainingSituation | undefined {
  return allQuickTrainingSituations.find((s: QuickTrainingSituation) => s.id === id);
}

export function getSituationsByDifficulty(difficulty: Difficulty): QuickTrainingSituation[] {
  return allQuickTrainingSituations.filter((s: QuickTrainingSituation) => s.difficulty === difficulty);
}

export function getSituationsByTags(tags: string[]): QuickTrainingSituation[] {
  return allQuickTrainingSituations.filter((s: QuickTrainingSituation) => 
    tags.some(tag => s.tags.includes(tag.toLowerCase()))
  );
} 