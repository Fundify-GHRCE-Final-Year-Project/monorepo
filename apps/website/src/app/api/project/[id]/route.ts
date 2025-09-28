// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB, ProjectModel } from "@fundify/database";


import { Types } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate that the given ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Find the project only by _id
    const project = await ProjectModel.findById(id);

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
    console.error("Error fetching project by ID:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}