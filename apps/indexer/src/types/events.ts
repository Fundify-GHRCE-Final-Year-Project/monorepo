export type ProjectCreated = {
  owner: string;
  index: number;
  goal: number;
  milestones: number;
  timestamp: number;
};

export type ProjectFunded = {
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: number;
  timestamp: number;
};

export type ProjectFundsReleased = {
  owner: string;
  index: number;
  amount: number;
  to: string;
  cycle: number;
  timestamp: number;
};

export type VotingCycleInitiated = {
  projectOwner: string;
  projectIndex: number;
  amount: number;
  depositWallet: string;
  votingCycle: number;
  votingDeadline: number;
  votesNeeded: number;
};

export type Voted = {
  projectOwner: string;
  projectIndex: number;
  voteBy: string;
  votingCycle: number;
};
