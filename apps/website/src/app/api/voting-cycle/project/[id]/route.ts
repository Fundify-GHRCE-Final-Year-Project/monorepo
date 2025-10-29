// ============================================
// File: monorepo/apps/website/src/app/api/voting-cycle/project/[id]/route.ts
// ============================================
import { NextResponse } from "next/server";
import { connectDB, VotingCycleModel } from "@fundify/database";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("API hit ✅, Project Index =", params.id);
    await connectDB();
    
    // Find the latest active voting cycle for this project
    const votingCycle = await VotingCycleModel.findOne({
      projectIndex: Number(params.id),
      ended: false, // Only get active cycles
    }).sort({ createdAt: -1 }); // Get the most recent one

    if (!votingCycle) {
      return NextResponse.json(
        { message: "No active voting cycle found" },
        { status: 404 }
      );
    }

    return NextResponse.json(votingCycle, { status: 200 });
  } catch (error) {
    console.error("Error fetching voting cycle:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
