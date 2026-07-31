import { CARE_PLAN_UI, TEAM_COPY } from '@/content/carePlan';
import { PARENT_FIRST_UI } from '@/content/carePlanParentFirst';

type MutableCopy = { text: string };

// Release cleanup: remove development/review framing and use the existing
// Texas ABA Centers public contact number instead of an unresolved clinic placeholder.
(CARE_PLAN_UI.developmentDraft as MutableCopy).text = '';
(TEAM_COPY.yes.contactLabel as MutableCopy).text =
  'Talk to Texas ABA Centers for help reaching the right clinic.';
(TEAM_COPY.yes.phoneNumber as MutableCopy).text = '(877) 771-5725';

// Product-language cleanup: this experience responds to what a parent selects
// with focused guidance and private tools. It is not a clinical or ongoing care plan.
(CARE_PLAN_UI.carePlanEyebrow as MutableCopy).text = 'My Family Support Guide';
(PARENT_FIRST_UI.pathForwardHeading as MutableCopy).text = 'Your support guide';
(PARENT_FIRST_UI.takeItHeading as MutableCopy).text = 'Take it with you';
(PARENT_FIRST_UI.takeItNote as MutableCopy).text =
  'A private tool you can use for this situation. Type into it on your phone or computer and save it there, or print it. It stays on your device — this site never sees it.';
