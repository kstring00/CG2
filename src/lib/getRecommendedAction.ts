import type { ParentContext } from './useParentContext';

export type ActionKind = 'phone' | 'link' | 'route' | 'calm';

export type RecommendedAction = {
  kind: ActionKind;
  label: string;
  /**
   * For 'phone' the raw E.164 number (no tel: prefix).
   * For 'link' an absolute external URL.
   * For 'route' an internal path. The sentinel '#start-intake' tells the
   * caller to re-open the IntakeFlow instead of navigating.
   * For 'calm' an internal path, or null to fall back to scroll-and-focus
   * the existing overwhelm card.
   */
  value: string | null;
  framing: string;
  permissionLine: string;
};

const NO_CONTEXT_ACTION: RecommendedAction = {
  kind: 'route',
  label: 'Start with two quick questions',
  value: '#start-intake',
  framing: "We don't know you yet.",
  permissionLine:
    'Two questions and we will point you at the one thing worth doing today.',
};

export function getRecommendedAction(
  context: Pick<ParentContext, 'currentSituation'>,
): RecommendedAction {
  switch (context.currentSituation) {
    case 'We just got the diagnosis':
      return {
        kind: 'phone',
        label: 'Call (877) 771-5725',
        value: '+18777715725',
        framing: 'Schedule the intake call. That is the one thing for today.',
        permissionLine: 'Everything else can wait until tomorrow.',
      };
    case "We're waiting on an evaluation":
      return {
        kind: 'link',
        label: 'Open the CDC milestone tracker',
        value: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
        framing: 'Track milestones while you wait. Five minutes is enough.',
        permissionLine: 'You do not need to do this perfectly.',
      };
    case "School isn't working":
      return {
        kind: 'route',
        // TODO: replace '#' with the IEP starter route once /support/iep-starter ships.
        label: 'Open the IEP starter guide',
        value: '#',
        framing:
          'One short read so you walk into the next meeting prepared.',
        permissionLine: 'You do not have to fix everything this week.',
      };
    case 'Therapy is in progress':
      return {
        kind: 'route',
        // TODO: replace '#' with the weekly focus route once /support/this-week ships.
        label: "See this week's focus",
        value: '#',
        framing: 'One small thing to reinforce at home this week.',
        permissionLine: 'Skip it if today is not the day.',
      };
    case "I'm just tired":
      return {
        kind: 'calm',
        // /calm exists today. If a future phase removes it, set value to null
        // and TodayCard will scroll-and-focus the overwhelm card instead.
        // TODO (Phase 4): replace /calm route with the in-place Calm Mode card.
        label: 'Take a breath',
        value: '/calm',
        framing: 'You do not have to do anything else today.',
        permissionLine: 'We will hold the rest.',
      };
    default:
      return NO_CONTEXT_ACTION;
  }
}
