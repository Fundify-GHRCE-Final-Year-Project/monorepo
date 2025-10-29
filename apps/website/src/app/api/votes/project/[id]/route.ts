// / ============================================
// File: monorepo/apps/website/src/app/api/votes/project/[id]/route.ts
// ============================================
import { NextResponse } from "next/server";
import { connectDB, VoteModel, VotingCycleModel } from "@fundify/database";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Get the current active voting cycle first
    const votingCycle = await VotingCycleModel.findOne({
      projectIndex: Number(params.id),
      ended: false,
    }).sort({ createdAt: -1 });

    if (!votingCycle) {
      return NextResponse.json([], { status: 200 });
    }

    // Get all votes for the current voting cycle
    const votes = await VoteModel.find({
      projectIndex: Number(params.id),
      votingCycle: votingCycle.votingCycle, // Use the cycle number
    });

    return NextResponse.json(votes, { status: 200 });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}