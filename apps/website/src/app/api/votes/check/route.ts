// ============================================
// File: monorepo/apps/website/src/app/api/votes/check/route.ts
// NEW ENDPOINT - Check if user has voted
// ============================================
import { NextResponse } from "next/server";
import { connectDB, VoteModel } from "@fundify/database";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { projectIndex, votingCycleNumber, investorWallet } =
      await req.json();

    if (!projectIndex || !votingCycleNumber || !investorWallet) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const vote = await VoteModel.findOne({
      projectIndex: Number(projectIndex),
      voteBy: investorWallet,
      votingCycle: Number(votingCycleNumber),
    });

    return NextResponse.json(
      {
        hasVoted: !!vote,
        vote: vote || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking vote:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}