export type Situation = {
  id: string;
  title: string;
  description: string;
  context: string;
  orderIndex: number;
  aiPersona: {
    name: string;
    role: string;
    personality: string;
    context: string;
  };
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  situations: Situation[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
};

export type UserPreferences = {
  id: string;
  userId: string;
  nativeLanguages: string[];
  socialLanguages: string[];
  professionalLanguages: string[];
  desiredProfessionalStyle: string | null;
  desiredSocialStyle: string | null;
  currentProfessionalStyle: string | null;
  currentSocialStyle: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserProgress = {
  id: string;
  userId: string;
  situationId: string;
  completed: boolean;
  score: number | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}; 