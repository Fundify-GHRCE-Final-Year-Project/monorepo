import { NextResponse } from "next/server";
import { ProjectModel } from "@fundify/database";
import { CATEGORY } from "@fundify/types";
import { title } from "process";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ address: string; index: string }> }
) {
  try {
    // extract parmeters from request
    const { address, index } = await params;
    const body = await request.json();
    console.log("update project title,description,members");
    console.log(address, index);

    const project = await ProjectModel.findOneAndUpdate(
      {
        owner: address,
      },
      {
        $set: {
          title: body.title,
          description: body.description,
          members: body.members,
          category: body.category,
        },
      },
      {
        sort: { score: -1 }, // sort option
        new: true, // return the updated doc
      }
    );

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
        error: "Error updating project metadata",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
