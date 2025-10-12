// app/api/projects/[id]/investments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB, ProjectModel, InvestmentModel, UserModel } from "@fundify/database";
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

    // Find the project by ID
    const project = await ProjectModel.findById(id);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Find all investments for this project using owner and index
    const investments = await InvestmentModel.find({
      projectOwner: project.owner,
      projectIndex: project.index,
    }).sort({ timestamp: -1 }); // Sort by most recent first

    // Get unique funder addresses
    const funderAddresses = [...new Set(investments.map((inv) => inv.funder))];

    // Fetch user details for all funders
    const funders = await UserModel.find({
      wallet: { $in: funderAddresses },
    });

    // Create a map of wallet address to user details
    const funderMap = new Map(
      funders.map((funder) => [funder.wallet.toLowerCase(), funder.toJSON()])
    );

    // Combine investment data with funder details
    const investmentsWithDetails = investments.map((investment) => {
      const investmentData = investment.toJSON();
      const funderDetails = funderMap.get(investment.funder.toLowerCase());

      return {
        ...investmentData,
        funderDetails: funderDetails || null,
      };
    });

    // Calculate summary statistics
    const totalInvestors = funderAddresses.length;
    const totalAmount = investments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalInvestments = investments.length;

    // Group investments by funder
    const investmentsByFunder = investments.reduce((acc, inv) => {
      const funderKey = inv.funder.toLowerCase();
      if (!acc[funderKey]) {
        acc[funderKey] = {
          funder: inv.funder,
          funderDetails: funderMap.get(funderKey) || null,
          totalAmount: 0,
          investmentCount: 0,
          investments: [],
        };
      }
      acc[funderKey].totalAmount += inv.amount;
      acc[funderKey].investmentCount += 1;
      acc[funderKey].investments.push(inv.toJSON());
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      ok: true,
      data: {
        project: {
          id: project._id,
          title: project.title,
          owner: project.owner,
          index: project.index,
          goal: project.goal,
          funded: project.funded,
        },
        summary: {
          totalInvestors,
          totalAmount,
          totalInvestments,
          averageInvestment: totalInvestments > 0 ? totalAmount / totalInvestments : 0,
        },
        investments: investmentsWithDetails,
        investmentsByFunder: Object.values(investmentsByFunder).sort(
          (a, b) => b.totalAmount - a.totalAmount
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching project investments:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}