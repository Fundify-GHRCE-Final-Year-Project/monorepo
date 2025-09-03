// app/api/users/[address]/investments/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@fundify/database";
import { InvestmentModel, ProjectModel } from "@fundify/database";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    await connectDB();

    const { address } = params;

    if (!address) {
      return NextResponse.json(
        { ok: false, error: "Address is required" },
        { status: 400 }
      );
    }

    // Find all investments by this user
    const investments = await InvestmentModel.find({
      funder: new RegExp(`^${address}$`, "i"), // case-insensitive match
    }).sort({ timestamp: -1 });

    // Get unique projects and populate them
    const projectKeys = new Set();
    const projectQueries = [];

    for (const inv of investments) {
      const key = `${inv.projectOwner}-${inv.projectIndex}`;
      if (!projectKeys.has(key)) {
        projectKeys.add(key);
        projectQueries.push({
          owner: inv.projectOwner,
          index: inv.projectIndex,
        });
      }
    }

    // Fetch all unique projects
    const projects = await ProjectModel.find({
      $or: projectQueries.length > 0 ? projectQueries : [{}],
    });

    // Create a map for quick project lookup
    const projectMap = new Map();
    projects.forEach((p) => {
      const key = `${p.owner}-${p.index}`;
      projectMap.set(key, p);
    });

    // Transform investments with project data
    const transformedInvestments = investments.map((inv) => {
      const invData = inv.toObject ? inv.toObject() : inv;
      const projectKey = `${inv.projectOwner}-${inv.projectIndex}`;
      const project = projectMap.get(projectKey);

      return {
        id: invData._id?.toString() || invData.id,
        funder: invData.funder,
        investmentIndex: invData.investmentIndex,
        projectOwner: invData.projectOwner,
        projectIndex: invData.projectIndex,
        amount: invData.amount,
        timestamp: invData.timestamp,
        amountETH: invData.amount || "0",
        project: project
          ? {
              id: project._id?.toString(),
              owner: project.owner,
              index: project.index,
              title: project.title || `Project ${project.index}`,
              description: project.description || `Project by ${project.owner}`,
              goal: project.goal,
              goalETH: parseFloat(project.goal || "0"),
              funded: project.funded,
              fundedETH: parseFloat(project.funded || "0"),
              milestones: project.milestones,
              timestamp: project.timestamp,
            }
          : null,
      };
    });

    return NextResponse.json({
      ok: true,
      data: transformedInvestments,
      meta: { total: transformedInvestments.length },
    });
  } catch (error) {
    console.error("Error fetching user investments:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
