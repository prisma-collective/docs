export type VerticalKey =
  | 'phase'
  | 'workPlan'
  | 'milestones'
  | 'deliverables'
  | 'budget'
  | 'payment';

export type LateralIndex = {
  id: string;
  title: string;
  timing: string;
  refs: Record<VerticalKey, readonly string[]>;
};

export const LATERALS: readonly LateralIndex[] = [
  {
    id: 'm1',
    title: 'Inception and Design',
    timing: 'Weeks 1–3',
    refs: {
      phase: ['phase-1'],
      workPlan: ['phase-1'],
      milestones: ['checkpoint-kickoff', 'checkpoint-research-design'],
      deliverables: [
        'del-kickoff-report',
        'del-research-design',
        'del-candidate-list',
        'del-interview-guide',
        'del-stakeholder-recruitment',
      ],
      budget: ['budget-pm', 'budget-ethics'],
      payment: ['pay-m1'],
    },
  },
  {
    id: 'm2',
    title: 'Regional Screening',
    timing: 'Weeks 4–6',
    refs: {
      phase: ['phase-2'],
      workPlan: ['phase-2'],
      milestones: ['checkpoint-regional-screening'],
      deliverables: ['del-preliminary-matrix', 'del-use-case-hypothesis'],
      budget: ['budget-screening'],
      payment: ['pay-m2'],
    },
  },
  {
    id: 'm3',
    title: 'Primary Research',
    timing: 'Weeks 7–12',
    refs: {
      phase: ['phase-3'],
      workPlan: ['phase-3'],
      milestones: [
        'checkpoint-access-check',
        'checkpoint-regulatory-infra',
        'checkpoint-interim-findings',
      ],
      deliverables: [
        'del-access-register',
        'del-interim-memo',
        'del-regulatory-interim',
      ],
      budget: [
        'budget-primary-research',
        'budget-hub-coordination',
        'budget-regulatory',
        'budget-contingency',
      ],
      payment: ['pay-m3'],
    },
  },
  {
    id: 'm4',
    title: 'Analysis and Drafting',
    timing: 'Weeks 13–17',
    refs: {
      phase: ['phase-4-1', 'phase-4-2'],
      workPlan: ['phase-4-1', 'phase-4-2'],
      milestones: ['checkpoint-draft-deliverables'],
      deliverables: [
        'del-market-matrix',
        'del-entry-playbooks',
        'del-use-case-viability',
        'del-regulatory-summaries',
        'del-counterparty-map',
        'del-infra-assessment',
        'del-cass',
        'del-roadmap',
        'del-executive-memo',
        'del-handoff-memo',
        'del-confidence-register',
      ],
      budget: ['budget-synthesis', 'budget-validation'],
      payment: ['pay-m4'],
    },
  },
  {
    id: 'm5',
    title: 'Final Delivery',
    timing: 'Week 18',
    refs: {
      phase: ['phase-5'],
      workPlan: ['phase-5'],
      milestones: ['checkpoint-final-report', 'checkpoint-public-summary'],
      deliverables: [
        'del-market-matrix',
        'del-entry-playbooks',
        'del-use-case-viability',
        'del-regulatory-summaries',
        'del-counterparty-map',
        'del-infra-assessment',
        'del-cass',
        'del-roadmap',
        'del-executive-memo',
        'del-handoff-memo',
        'del-confidence-register',
        'del-public-summary',
        'del-supporting-bundle',
      ],
      budget: ['budget-report-writing'],
      payment: ['pay-m5'],
    },
  },
] as const;

export const VERTICAL_LABELS: Record<VerticalKey, string> = {
  phase: 'Phase',
  workPlan: 'Work plan',
  milestones: 'Milestones',
  deliverables: 'Deliverables',
  budget: 'Budget',
  payment: 'Payment schedule',
};
