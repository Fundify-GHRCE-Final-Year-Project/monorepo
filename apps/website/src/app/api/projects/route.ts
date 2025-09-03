// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@fundify/database";
import { ProjectModel } from "@fundify/database";

// Helper to transform project document into computed fields
function transformProject(project: any) {
  // Convert to plain object
  const projectData = project.toObject ? project.toObject() : project;

  // Parse BigInt strings to numbers and convert to ETH
  const funded = parseFloat(projectData.funded || "0");
  const goal = parseFloat(projectData.goal || "0");
  const released = parseFloat(projectData.released || "0");

  return {
    id: projectData._id?.toString() || projectData.id,
    owner: projectData.owner,
    index: projectData.index,
    goal: projectData.goal,
    milestones: projectData.milestones,
    funded: projectData.funded,
    released: projectData.released,
    timestamp: projectData.timestamp,
    title: projectData.title || `Project ${projectData.index}`,
    description: projectData.description || `Project by ${projectData.owner}`,
    fundedETH: funded,
    goalETH: goal,
    releasedETH: released,
    fundingPercentage: goal > 0 ? (funded / goal) * 100 : 0,
    isFullyFunded: funded >= goal,
    remainingToGoal: Math.max(0, goal - funded),
    createdAt: projectData.createdAt,
    updatedAt: projectData.updatedAt,
  };
}

// GET → return all projects (no filters)
export async function GET() {
  try {
    await connectDB();

    const projects = await ProjectModel.find({}).sort({ timestamp: -1 });
    const transformed = projects.map(transformProject);

    return NextResponse.json({
      ok: true,
      data: transformed,
      meta: { total: transformed.length },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST → with filters, search, pagination
export async function POST(req: Request) {
  try {
    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { search = "", status = "all", limit = 50, offset = 0 } = body;

    // Build query
    const query: any = {};

    // Search (title, description, owner)
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { owner: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch all projects first, then apply status filtering in JavaScript
    // since we need computed fields
    const allProjects = await ProjectModel.find(query).sort({ timestamp: -1 });
    const transformed = allProjects.map(transformProject);

    // Apply status filter
    let filtered = transformed;
    if (status === "active") {
      filtered = transformed.filter(
        (p) => !p.isFullyFunded && p.fundingPercentage < 100
      );
    } else if (status === "funded") {
      filtered = transformed.filter(
        (p) => p.isFullyFunded || p.fundingPercentage >= 100
      );
    } else if (status === "ended") {
      // Consider a project ended if it's old or reached goal
      const ninetyDaysAgo = Date.now() / 1000 - 90 * 24 * 60 * 60;
      filtered = transformed.filter((p) => {
        const isOld = p.timestamp < ninetyDaysAgo;
        return isOld || p.isFullyFunded;
      });
    }

    // Apply pagination
    const paginatedResults = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      ok: true,
      data: paginatedResults,
      meta: {
        total: filtered.length,
        hasMore: offset + paginatedResults.length < filtered.length,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
