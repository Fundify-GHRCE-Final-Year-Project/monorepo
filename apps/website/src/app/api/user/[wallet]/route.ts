// app/api/user/[wallet]/route.ts
import { NextResponse } from "next/server";
import { connectDB, UserModel } from "@fundify/database";

export async function GET(
  req: Request,
  { params }: { params: { wallet: string } }
) {
  try {
    await connectDB();
    const wallet = params.wallet;
    if (!wallet) return NextResponse.json({}, { status: 400 });

    const user = await UserModel.findOne({ wallet });
    return NextResponse.json(user || {});
  } catch (err) {
    console.error("GET /api/user/[wallet] error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { wallet: string } }
) {
  try {
    await connectDB();
    const wallet = params.wallet;
    const body = await req.json();

    // Force wallet to be present (prevent overwriting with empty wallet)
    const updatedUser = await UserModel.findOneAndUpdate(
      { wallet },
      { $set: { ...body, wallet } }, // ensure wallet saved
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("PUT /api/user/[wallet] error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
