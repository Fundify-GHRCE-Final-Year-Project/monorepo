export type Project = {
    owner: string; 
    index: number;
    goal: number;
    milestones: number;
    funded: number;
    released: number;
    timestamp: bigint;
}

export type Investment = {
    funder: string,
    investmentIndex: number
    projectOwner: string; 
    projectIndex: number;
    amount: number;
    timestamp: bigint;
}