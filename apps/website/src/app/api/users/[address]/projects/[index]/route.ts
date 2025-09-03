// app/api/users/[address]/projects/[index]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@fundify/database";
import { ProjectModel } from "@fundify/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string; index: string } }
) {
  try {
    await connectDB();

    const { address, index } = params;

    if (!address || !index) {
      return NextResponse.json(
        { ok: false, error: "Address and project index are required" },
        { status: 400 }
      );
    }

    const projectIndex = parseInt(index);
    if (isNaN(projectIndex)) {
      return NextResponse.json(
        { ok: false, error: "Invalid project index" },
        { status: 400 }
      );
    }

    // Find the specific project
    const project = await ProjectModel.findOne({
      owner: address.toLowerCase(),
      index: projectIndex,
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: project.toJSON(),
    });
  } catch (error) {
    console.error("Error fetching specific project:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
