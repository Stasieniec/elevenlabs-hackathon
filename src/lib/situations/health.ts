import { QuickTrainingSituation } from '../types/situations';
import { healthTemplates } from './templates/health';
import { processSituationTemplate } from './templateProcessor';

// Process the health situations
const doctorVisit = processSituationTemplate(
  healthTemplates[0],
  undefined,
  "medium"
);

const chronicPain = processSituationTemplate(
  healthTemplates[1],
  undefined,
  "medium"
);

export const healthSituations: QuickTrainingSituation[] = [
  doctorVisit,
  chronicPain
]; 