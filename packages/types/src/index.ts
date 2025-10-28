export type Project = {
  owner: string;
  index: number;
  goal: number;
  milestones: number;
  funded: number;
  released: number;
  timestamp: bigint;
};

export type Investment = {
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: number;
  timestamp: bigint;
};

export type Experience = {
  role: string;
  company: string;
  duration: string;
};

export type User = {
  wallet: string;
  name: string;
  country: string;
  role: string;
  phone: string;
  address: string;
  skills: string[];
  experiences: Experience[];
  linkedin: string;
  x: string;
  github: string;
  interests: CATEGORY[];
};

export enum CATEGORY {
  Medical = "Medical",
  Coding = "Coding",
  Technology = "Technology",
  Pharmacy = "Pharmacy",
  Army = "Army",
  Defence = "Defence",
  Farming = "Farming",
  Finance = "Finance",
  Education = "Education",
  Environment = "Environment",
  Sports = "Sports",
  ArtsAndCulture = "Art & Culture",
  Travel = "Travel",
  SocialWork = "Social Work",
  Music = "Music",
  Business = "Business",
  Science = "Science",
}

export type VotingCycle = {
  projectOwner: string;
  projectIndex: number;
  amount: number;
  depositWallet: string;
  votingCycle: number;
  votingDeadline: number;
  votesNeeded: number;
  votesGathered: number;
  ended: boolean;
}

export type Vote = {
  projectOwner: string;
  projectIndex: number;
  voteBy: string;
  votingCycle: number;
}

export type ProjectFundsReleased = {
  owner: string;
  index: number;
  amount: number;
  to: string;
  cycle: number;
  timestamp: number;
}

export type VotingCycleInitiated = {
  projectOwner: string;
  projectIndex: number;
  amount: number;
  depositWallet: string;
  votingCycle: number;
  votingDeadline: number;
  votesNeeded: number;
  timestamp: number;
}

export type Voted = {
  projectOwner: string;
  projectIndex: number;
  voteBy: string;
  votingCycle: number;
  timestamp: number;
}