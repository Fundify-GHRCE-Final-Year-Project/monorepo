export type ProjectCreated = {
    owner: string,
    index: number,
    goal: number,
    milestones: number,
    timestamp: number,
}

export type ProjectFunded = {
    funder: string,
    investmentIndex: number,
    projectOwner: string,
    projectIndex: number,
    amount: number,
    timestamp: number,
}

export type ProjectFundsReleased = {
    owner: string,
    index: number,
    amount: number,
    to: string,
    timestamp: number,
}