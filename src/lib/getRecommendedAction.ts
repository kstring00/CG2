import type { ParentContext } from './useParentContext';

export type TodayAction =
  | { type: 'phone'; label: string; value: string }
  | { type: 'link'; label: string; value: string }
  | { type: 'route'; label: string; value: string };

export type CalmSignal = { type: 'calm' };

export type RecommendedAction = TodayAction | CalmSignal;

const DEFAULT_ACTION: TodayAction = {
  type: 'route',
  label: 'Start with two quick questions',
  value: '/intake',
};

export function getRecommendedAction(
  context: Pick<ParentContext, 'currentSituation'>,
): RecommendedAction {
  switch (context.currentSituation) {
    case 'We just got the diagnosis':
      return {
        type: 'phone',
        label: 'Call (877) 771-5725 to schedule intake',
        value: 'tel:+18777715725',
      };
    case "We're waiting on an evaluation":
      return {
        type: 'link',
        label: 'CDC milestone tracker',
        value: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
      };
    case "School isn't working":
      return {
        type: 'route',
        label: 'IEP starter guide',
        value: '/support/iep-starter',
      };
    case 'Therapy is in progress':
      return {
        type: 'route',
        label: "This week's focus",
        value: '/support/this-week',
      };
    case "I'm just tired":
      return { type: 'calm' };
    default:
      return DEFAULT_ACTION;
  }
}

export function isCalmSignal(action: RecommendedAction): action is CalmSignal {
  return action.type === 'calm';
}
