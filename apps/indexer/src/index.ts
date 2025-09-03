import { abi, contractAddress } from "@fundify/contract";
import {
  parseProjectCreatedLog,
  parseProjectFundedLog,
  parseProjectFundsReleasedLog,
} from "./lib/eventParsers.ts";
import { connectDB } from "@fundify/database";
import { ProjectModel, InvestmentModel } from "@fundify/database";
import { getRandomProject } from "./lib/dummyProjects.ts";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const rpcUrl = "http://127.0.0.1:8545";
if (!rpcUrl) throw new Error("rpc url is not set");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contractInterface = new ethers.Interface(abi);

async function fetchAndProcess(fromBlock: number, toBlock: number) {
  const filter = {
    address: contractAddress,
    fromBlock,
    toBlock,
  };

  const logs = await provider.getLogs(filter);

  for (const log of logs) {
    const parsedLog = contractInterface.parseLog(log);
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

function main() {
  try {
    const mongodb_uri = process.env.MONGODB_URI;
    if (!mongodb_uri) {
      throw new Error("MONGODB_URI not set.");
    }
    connectDB();
    console.log("Running indexer...");
    console.log("");
    let lastProcessed = 0;
    setInterval(async () => {
      const latest = await provider.getBlockNumber();
      if (latest > lastProcessed) {
        await fetchAndProcess(lastProcessed + 1, latest);
        lastProcessed = latest;
      }
    }, 10 * 1000);
  } catch (error) {
    console.log(error);
  }
}

main();
