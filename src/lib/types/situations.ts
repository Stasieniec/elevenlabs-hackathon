export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = 'professional' | 'social' | 'family' | 'identity' | 'fun';

export interface BaseSituation {
  id: string;
  title: string;
  description: string;
  icon: string;
  context: string;
  userGoal: string;
  aiRole: string;
}

export interface QuickTrainingSituation extends BaseSituation {
  difficulty: Difficulty;
  category: Category;
  tags: string[];
}

export interface CustomSituation extends BaseSituation {
  createdAt: Date;
  userId: string;
  isPublic?: boolean;
}

export interface SituationTemplate extends BaseSituation {
  category: Category;
  variables: {
    name: string;
    description: string;
    defaultValue?: string;
  }[];
} 