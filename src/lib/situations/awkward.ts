import { QuickTrainingSituation } from '../types/situations';
import { awkwardTemplates } from './templates/awkward';
import { processSituationTemplate } from './templateProcessor';

// Process the awkward situations
const moneyFriendSituation = processSituationTemplate(
  awkwardTemplates[0],
  undefined,
  "medium"
);

const roommateHygieneSituation = processSituationTemplate(
  awkwardTemplates[1],
  undefined,
  "medium"
);

export const awkwardSituations: QuickTrainingSituation[] = [
  moneyFriendSituation,
  roommateHygieneSituation
]; 