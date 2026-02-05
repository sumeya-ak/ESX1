import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";
import { hashPassword, generateSMEId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyName, email, phone, password } = body || {};

  if (!companyName || !email || !phone || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  const smeId = generateSMEId();

  const session = await User.db.startSession();
  session.startTransaction();
  try {
    const user = await User.create([
      { smeId, companyName, email, phone, password: hashed }], { session });
    await Company.create([{ name: companyName, industry: "Unspecified", country: "Unspecified", revenue: 0 }], { session });
    await session.commitTransaction();
    return NextResponse.json(user[0], { status: 201 });
  } catch (err) {
    console.error('Registration error:', err);
    await session.abortTransaction();
    return NextResponse.json({ error: 'Registration failed', details: (err as Error).message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
