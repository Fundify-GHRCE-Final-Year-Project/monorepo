import { abi } from "@fundify/contract";
import {
  parseProjectCreatedLog,
  parseProjectFundedLog,
  parseProjectFundsReleasedLog,
  parseVotingCycleInitiatedLog,
  parseVotedLog,
} from "./lib/eventParsers";
import { connectDB } from "@fundify/database";
import { ProjectModel, InvestmentModel } from "@fundify/database";
import {
  VotingCycleModel,
  VoteModel,
  ProjectFundsReleasedModel,
} from "@fundify/database";
import { getRandomProject } from "./lib/dummyProjects";
import { ethers } from "ethers";
require("dotenv").config();

const contractAddress = process.env["CONTRACT_ADDRESS"];
if (!contractAddress) throw new Error("CONTRACT_ADDRESS is not set");
const rpcUrl = process.env["RPC_URL"];
if (!rpcUrl) throw new Error("RPC_URL is not set");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contractInterface = new ethers.Interface(abi);

async function fetchAndProcess(fromBlock: number, toBlock: number) {
  if (!contractAddress) throw new Error("CONTRACT_ADDRESS is not set");

  const filter = {
    address: contractAddress,
    fromBlock,
    toBlock,
  };

  const logs = await provider.getLogs(filter);

  for (const log of logs) {
    const parsedLog = contractInterface.parseLog(log);
    // const block = await provider.getBlock(log.blockNumber);
    // const blockTimestamp = block?.timestamp || 0;

    console.log("Indexed :-");
    console.log(parsedLog?.name);
    console.log("Data: ", parsedLog?.args);
    console.log("");
    switch (parsedLog?.name) {
      case "ProjectCreated":
        let projectCreated = parseProjectCreatedLog(parsedLog);
        const dummyProject = getRandomProject();
        if (projectCreated) {
          const savedProject = await ProjectModel.create({
            owner: projectCreated.owner,
            index: projectCreated.index,
            goal: projectCreated.goal,
            milestones: projectCreated.milestones,
            funded: 0,
            released: 0,
            timestamp: projectCreated.timestamp,
            title: dummyProject?.title,
            description: dummyProject?.description,
            category: dummyProject?.category,
          });
          console.log("Saved Project To MongoDB :-");
          console.log(savedProject);
          console.log("");
        } else console.log("Something wrong happened!");
        break;
      case "ProjectFunded":
        let projectFunded = parseProjectFundedLog(parsedLog);
        if (projectFunded) {
          const updatedProject = await ProjectModel.updateOne(
            {
              owner: projectFunded.projectOwner,
              index: projectFunded.projectIndex,
            },
            { $inc: { funded: projectFunded.amount } }
          );
          console.log("Updated Project Fund Amount At MongoDB :-");
          console.log(updatedProject);
          console.log("");

          const savedInvestment = await InvestmentModel.create({
            funder: projectFunded.funder,
            investmentIndex: projectFunded.investmentIndex,
            projectOwner: projectFunded.projectOwner,
            projectIndex: projectFunded.projectIndex,
            amount: projectFunded.amount,
            timestamp: projectFunded.timestamp,
          });
          console.log("Saved Investment To MongoDB :-");
          console.log(savedInvestment);
          console.log("");
        } else console.log("Something wrong happened!");
        break;
      case "ProjectFundsReleased":
        let projectFundsReleased = parseProjectFundsReleasedLog(parsedLog);
        if (projectFundsReleased) {
          // Update project released amount
          const updatedProject = await ProjectModel.updateOne(
            {
              owner: projectFundsReleased.owner,
              index: projectFundsReleased.index,
            },
            { $inc: { released: projectFundsReleased.amount } }
          );
          console.log("Updated Project Fund Amount At MongoDB :-");
          console.log(updatedProject);
          console.log("");

          // Save ProjectFundsReleased document
          const savedProjectFundsReleased =
            await ProjectFundsReleasedModel.create({
              owner: projectFundsReleased.owner,
              index: projectFundsReleased.index,
              amount: projectFundsReleased.amount,
              to: projectFundsReleased.to,
              cycle: projectFundsReleased.cycle,
              timestamp: projectFundsReleased.timestamp,
            });
          console.log("Saved ProjectFundsReleased To MongoDB :-");
          console.log(savedProjectFundsReleased);
          console.log("");

          // Mark the relevant VotingCycle as ended
          const updatedVotingCycle = await VotingCycleModel.updateOne(
            {
              projectOwner: projectFundsReleased.owner,
              projectIndex: projectFundsReleased.index,
              votingCycle: projectFundsReleased.cycle,
            },
            { $set: { ended: true } }
          );
          console.log("Updated VotingCycle ended status At MongoDB :-");
          console.log(updatedVotingCycle);
          console.log("");
        } else console.log("Something wrong happened!");
        break;
      case "VotingCycleInitiated":
        let votingCycleInitiated = parseVotingCycleInitiatedLog(parsedLog);
        if (votingCycleInitiated) {
          const savedVotingCycle = await VotingCycleModel.create({
            projectOwner: votingCycleInitiated.projectOwner,
            projectIndex: votingCycleInitiated.projectIndex,
            amount: votingCycleInitiated.amount,
            depositWallet: votingCycleInitiated.depositWallet,
            votingCycle: votingCycleInitiated.votingCycle,
            votingDeadline: votingCycleInitiated.votingDeadline,
            votesNeeded: votingCycleInitiated.votesNeeded,
            votesGathered: 0,
            ended: false,
          });
          console.log("Saved VotingCycle To MongoDB :-");
          console.log(savedVotingCycle);
          console.log("");
        } else console.log("Something wrong happened!");
        break;
      case "Voted":
        let voted = parseVotedLog(parsedLog);
        if (voted) {
          // Save the vote
          const savedVote = await VoteModel.create({
            projectOwner: voted.projectOwner,
            projectIndex: voted.projectIndex,
            voteBy: voted.voteBy,
            votingCycle: voted.votingCycle,
          });
          console.log("Saved Vote To MongoDB :-");
          console.log(savedVote);
          console.log("");

          // Increment votesGathered for the relevant VotingCycle
          const updatedVotingCycle = await VotingCycleModel.updateOne(
            {
              projectOwner: voted.projectOwner,
              projectIndex: voted.projectIndex,
              votingCycle: voted.votingCycle,
            },
            { $inc: { votesGathered: 1 } }
          );
          console.log("Updated VotingCycle votesGathered At MongoDB :-");
          console.log(updatedVotingCycle);
          console.log("");
        } else console.log("Something wrong happened!");
        break;
      default:
        console.log("Unknown event name encountered");
        console.log(`Event: ${parsedLog?.name}`);
        console.log(`Data: ${parsedLog?.args}`);
        console.log("");
    }
  }
}

async function main() {
  try {
    if (!contractAddress) throw new Error("CONTRACT_ADDRESS is not set");
    const mongodb_uri = process.env["MONGODB_URI"];
    if (!mongodb_uri) {
      throw new Error("MONGODB_URI not set.");
    }
    await connectDB();
    console.log("Running indexer...");
    console.log("");
    let lastProcessedBlock = 0;
    setInterval(async () => {
      const latest = await provider.getBlockNumber();
      if (latest > lastProcessedBlock) {
        await fetchAndProcess(lastProcessedBlock + 1, latest);
        lastProcessedBlock = latest;
      }
    }, 10 * 1000);
  } catch (error) {
    console.log(error);
  }
}

main();
