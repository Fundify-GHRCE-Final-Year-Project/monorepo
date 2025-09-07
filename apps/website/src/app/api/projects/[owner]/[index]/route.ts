import { NextResponse } from "next/server";
import { connectDB, ProjectModel } from "@fundify/database";
import { CATEGORY } from "@fundify/types";
import { title } from "process";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; index: string }> }
) {
  try {
    await connectDB();
    // extract parmeters from request
    const { owner, index } = await params;
    const body = await request.json();

    const project = await ProjectModel.findOne({
      owner: owner,
    });

    return NextResponse.json(
      {
        ok: true,
        data: project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // if any error occurs, return 500
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        ok: false,
        error: "Error fetching project",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
