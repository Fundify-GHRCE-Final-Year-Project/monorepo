// ============================================
// File: monorepo/apps/website/src/app/api/votes/create/route.ts
// ============================================
import { NextResponse } from "next/server";
import { connectDB, VoteModel, VotingCycleModel } from "@fundify/database";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { projectIndex, votingCycleNumber, investorWallet, projectOwner } =
      await req.json();

    if (!projectIndex || !votingCycleNumber || !investorWallet || !projectOwner) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already voted for this cycle
    const existing = await VoteModel.findOne({
      projectIndex: Number(projectIndex),
      voteBy: investorWallet,
      votingCycle: Number(votingCycleNumber),
    });

    if (existing) {
      return NextResponse.json(
        { message: "You already voted for this cycle" },
        { status: 400 }
      );
    }

    // Create the vote
    const newVote = await VoteModel.create({
      projectOwner: projectOwner,
      projectIndex: Number(projectIndex),
      voteBy: investorWallet,
      votingCycle: Number(votingCycleNumber),
    });

    // Update the votesGathered count in VotingCycle
    await VotingCycleModel.findOneAndUpdate(
      {
        projectIndex: Number(projectIndex),
        votingCycle: Number(votingCycleNumber),
      },
      {
        $inc: { votesGathered: 1 },
      }
    );

    return NextResponse.json(newVote, { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}