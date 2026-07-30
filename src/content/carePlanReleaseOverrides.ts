import { CARE_PLAN_UI, TEAM_COPY } from '@/content/carePlan';

type MutableCopy = { text: string };

// Release cleanup: remove development/review framing and use the existing
// Texas ABA Centers public contact number instead of an unresolved clinic placeholder.
(CARE_PLAN_UI.developmentDraft as MutableCopy).text = '';
(TEAM_COPY.yes.contactLabel as MutableCopy).text =
  'Talk to Texas ABA Centers for help reaching the right clinic.';
(TEAM_COPY.yes.phoneNumber as MutableCopy).text = '(877) 771-5725';
