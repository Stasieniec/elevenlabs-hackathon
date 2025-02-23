import { Difficulty } from '../types/situations';

export const difficultyColors: Record<Difficulty, { bg: string, text: string }> = {
  easy: { bg: 'bg-green-100', text: 'text-green-700' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  hard: { bg: 'bg-red-100', text: 'text-red-700' }
}; 