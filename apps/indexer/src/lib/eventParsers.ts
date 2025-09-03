import type { ProjectCreated, ProjectFunded, ProjectFundsReleased } from "../types/events";
import { ethers } from "ethers";

// Running indexer...
// Event: OwnershipTransferred
// Data: 0x0000000000000000000000000000000000000000,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Event: Initialized
// Data: 1
// Event: ProjectCreated
// Data: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,0,10000000000000000000,2,1755233580
// Event: ProjectCreated
// Data: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,1,5000000000000000000,3,1755233580
// Event: ProjectCreated
// Data: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,2,20000000000000000000,4,1755233580

export function parseProjectCreatedLog(log: ethers.LogDescription | null): ProjectCreated | null {
    if (log && log.args) {
        // Access parameters by position
        return {
            owner: String(log.args[0]),
            index: Number(log.args[1]),
            goal: Number(log.args[2] / BigInt(10**18)),
            milestones: Number(log.args[3]),
            timestamp: Number(log.args[4]),
        };
    }
    return null;
}

export function parseProjectFundedLog(log: ethers.LogDescription | null): ProjectFunded | null {
    if (log && log.args) {
        return {
            funder: String(log.args[0]),
            investmentIndex: Number(log.args[1]),
            projectOwner: String(log.args[3]),
            projectIndex: Number(log.args[4]),
            amount: Number(log.args[2] / BigInt(10**18)),
            timestamp: Number(log.args[5]),
        };
    }
    return null;
}

export function parseProjectFundsReleasedLog(log: ethers.LogDescription | null): ProjectFundsReleased | null {
    if (log && log.args) {
        return {
            owner: String(log.args[0]),
            index: Number(log.args[1]),
            amount: Number(log.args[2] / BigInt(10**18)),
            to: String(log.args[3]),
            timestamp: Number(log.args[4]),
        };
    }
    return null;
}