import { QuickTrainingSituation } from '../types/situations';
import { mentalTemplates } from './templates/mental';
import { processSituationTemplate } from './templateProcessor';

// Process the mental health situations
const burnoutSituation = processSituationTemplate(
  mentalTemplates[0],
  undefined,
  "medium"
);

const depressionSituation = processSituationTemplate(
  mentalTemplates[1],
  undefined,
  "medium"
);

export const mentalSituations: QuickTrainingSituation[] = [
  burnoutSituation,
  depressionSituation
]; 