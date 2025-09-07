// app/api/users/[address]/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@fundify/database";
import { ProjectModel } from "@fundify/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  console.log("API Route: GET /api/users/[address]/projects called");

  try {
    await connectDB();
    const { address } = params;
    console.log("API Route: Address received:", address);

    if (!address) {
      console.log("API Route: No address provided");
      return NextResponse.json(
        { ok: false, error: "Address is required" },
        { status: 400 }
      );
    }

    // Clean and normalize the address
    const cleanAddress = address;
    console.log("API Route: Clean address:", cleanAddress);

    // Connect to database
    console.log("API Route: Connecting to database...");
    await connectDB();
    console.log("API Route: Database connected successfully");

    // Find all projects owned by this user
    console.log("API Route: Searching for projects with owner:", cleanAddress);
    const projects = await ProjectModel.find({
      owner: cleanAddress,
    })
      .sort({ timestamp: -1 })
      .lean(); // Use .lean() for better performance

    console.log("API Route: Found projects:", projects.length);
    console.log("API Route: Sample project data:", projects[0] || "None");

    // Transform the data to ensure all fields are properly formatted
    const transformedProjects = projects.map((project) => ({
      _id: project._id?.toString(),
      owner: project.owner,
      index: project.index,
      goal: project.goal?.toString() || "0",
      milestones: project.milestones || 0,
      funded: project.funded?.toString() || "0",
      released: project.released?.toString() || "0",
      timestamp: project.timestamp || 0,
      title: project.title || "",
      description: project.description || "",
    }));

    console.log(
      "API Route: Returning transformed projects:",
      transformedProjects.length
    );

    return NextResponse.json({
      ok: true,
      data: transformedProjects,
    });
  } catch (error) {
    console.error("API Route: Error fetching user projects:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to fetch projects",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
