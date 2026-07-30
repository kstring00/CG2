import {
  CARE_PLAN_UI,
  CRISIS_PAGE,
  PLAN_ROWS,
  TEAM_COPY,
  resolveBranch,
  type ActionDefinition,
  type BranchId,
  type CopyEntry,
  type PlanRowDefinition,
  type RowId,
  type StandardBranchId,
  type StandardRowId,
  type TeamMode,
} from '@/content/carePlan';

export type TeamContact = {
  label: CopyEntry;
  phoneNumber: CopyEntry;
  href: string | null;
};

export type StandardPlanPage = {
  kind: 'standard';
  team: TeamMode;
  branch: StandardBranchId;
  row: StandardRowId;
  acknowledgment: CopyEntry;
  truth: CopyEntry;
  body: CopyEntry[];
  action: ActionDefinition;
  sessionHeading: CopyEntry;
  questions: CopyEntry[];
  crossLink?: {
    label: CopyEntry;
    detail: CopyEntry;
    href: string;
  };
  startOverHref: string;
  teamContact: TeamContact;
  providerEvaluationNote?: CopyEntry;
  safetyLink?: {
    copy: CopyEntry;
    href: string;
  };
  quietSupport?: CopyEntry;
  domesticViolence?: CopyEntry;
  education?: PlanRowDefinition['education'];
  printableRelativeGuide?: PlanRowDefinition['printableRelativeGuide'];
};

export type CrisisPlanPage = {
  kind: 'crisis';
  team: TeamMode;
  branch: 'crisis';
  row: 'crisis';
  acknowledgment: CopyEntry;
  truth: CopyEntry;
  body: CopyEntry[];
  documentationHeading: CopyEntry;
  documentationItems: readonly CopyEntry[];
  documentationExample: CopyEntry;
  questionsHeading: CopyEntry;
  questions: readonly CopyEntry[];
  phoneHeading: CopyEntry;
  immediateDangerHeading: CopyEntry;
  immediateDangerBody: CopyEntry;
  teamContact: TeamContact;
  startOverHref: string;
};

export type PlanPage = StandardPlanPage | CrisisPlanPage;

function phoneHref(team: TeamMode, phoneNumber: string): string | null {
  if (team === 'yes') return null;
  const digits = phoneNumber.replace(/\D/g, '');
  return digits ? `tel:+${digits}` : null;
}

function teamContact(team: TeamMode): TeamContact {
  const copy = TEAM_COPY[team];
  return {
    label: copy.contactLabel,
    phoneNumber: copy.phoneNumber,
    href: phoneHref(team, copy.phoneNumber.text),
  };
}

function standardHref(team: TeamMode, branch: StandardBranchId, row?: StandardRowId): string {
  const params = new URLSearchParams({ team, b: branch });
  if (row) params.set('r', row);
  return `/support/care-plan?${params.toString()}`;
}

// V2 SEAM: future AI insertion point. In v2 this becomes a server-side call that selects/adapts within the approved content bank (BAA + compliance review required first). Nothing upstream or downstream changes.
export function buildPlan(
  team: TeamMode,
  branch: BranchId,
  row: RowId,
): PlanPage {
  const resolvedTeam: TeamMode = team === 'no' ? 'no' : 'yes';
  const contact = teamContact(resolvedTeam);
  const startOverHref = `/support/care-plan?team=${resolvedTeam}`;

  if (branch === 'crisis' || row === 'crisis') {
    return {
      kind: 'crisis',
      team: resolvedTeam,
      branch: 'crisis',
      row: 'crisis',
      acknowledgment: CRISIS_PAGE.acknowledgment,
      truth: CRISIS_PAGE.truth,
      body: [...CRISIS_PAGE.body],
      documentationHeading: CRISIS_PAGE.documentationHeading,
      documentationItems: CRISIS_PAGE.documentationItems,
      documentationExample: CRISIS_PAGE.documentationExample,
      questionsHeading: CRISIS_PAGE.questionsHeading,
      questions: CRISIS_PAGE.questions,
      phoneHeading: CRISIS_PAGE.phoneHeading,
      immediateDangerHeading: CRISIS_PAGE.immediateDangerHeading,
      immediateDangerBody: CRISIS_PAGE.immediateDangerBody,
      teamContact: contact,
      startOverHref,
    };
  }

  const definition = PLAN_ROWS[row as StandardRowId];
  if (!definition || definition.branch !== branch) {
    throw new Error(`Invalid Care Plan selection: ${branch}/${row}`);
  }
  // Branch 4 swaps its rows in team=no mode, so a row that belongs to the branch
  // may still not belong to this team's version of it.
  if (!isRowInBranch(resolvedTeam, branch, definition.id)) {
    throw new Error(`Invalid Care Plan selection for team=${resolvedTeam}: ${branch}/${row}`);
  }

  const providerEvaluationNote =
    resolvedTeam === 'no' && branch === 'working'
      ? TEAM_COPY.no.providerEvaluationNote
      : undefined;

  return {
    kind: 'standard',
    team: resolvedTeam,
    branch: definition.branch,
    row: definition.id,
    acknowledgment: definition.acknowledgment,
    truth: definition.truth,
    body: [...definition.body],
    action: definition.action,
    sessionHeading: TEAM_COPY[resolvedTeam].sessionHeading,
    questions: [...definition.questions],
    crossLink: definition.crossLink
      ? {
          label: definition.crossLink.label,
          detail: definition.crossLink.detail,
          href: standardHref(
            resolvedTeam,
            definition.crossLink.branch,
            definition.crossLink.row,
          ),
        }
      : undefined,
    startOverHref,
    teamContact: contact,
    providerEvaluationNote,
    safetyLink: definition.safetyLink
      ? {
          copy: definition.safetyLink,
          href: `/support/care-plan/crisis?team=${resolvedTeam}`,
        }
      : undefined,
    quietSupport: definition.quietSupport,
    domesticViolence: definition.domesticViolence,
    education: definition.education,
    printableRelativeGuide: definition.printableRelativeGuide,
  };
}

export function isStandardBranchId(value: string | undefined): value is StandardBranchId {
  return value === 'behaviors' || value === 'load' || value === 'empty' || value === 'working';
}

export function isStandardRowId(value: string | undefined): value is StandardRowId {
  return Boolean(value && value in PLAN_ROWS);
}

/** Whether a row is reachable in this team mode's version of the branch. */
export function isRowInBranch(
  team: TeamMode,
  branch: StandardBranchId,
  row: StandardRowId,
): boolean {
  return resolveBranch(team, branch).rows.includes(row);
}

export function branchHref(team: TeamMode, branch: StandardBranchId): string {
  return standardHref(team, branch);
}

export function rowHref(team: TeamMode, branch: StandardBranchId, row: StandardRowId): string {
  return standardHref(team, branch, row);
}

export { CARE_PLAN_UI };
