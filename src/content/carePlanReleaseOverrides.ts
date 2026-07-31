import { CARE_PLAN_UI, TEAM_COPY } from '@/content/carePlan';

type MutableCopy = { text: string };

// Release cleanup: remove development/review framing, use the existing
// Texas ABA Centers public contact number, and describe the responsive tool
// accurately as a parent support guide rather than a clinical care plan.
(CARE_PLAN_UI.developmentDraft as MutableCopy).text = '';
(CARE_PLAN_UI.carePlanEyebrow as MutableCopy).text = 'My Family Support Guide';
(CARE_PLAN_UI.planActionLabel as MutableCopy).text = 'A starting point for right now';
(TEAM_COPY.yes.contactLabel as MutableCopy).text =
  'Talk to Texas ABA Centers for help reaching the right clinic.';
(TEAM_COPY.yes.phoneNumber as MutableCopy).text = '(877) 771-5725';
