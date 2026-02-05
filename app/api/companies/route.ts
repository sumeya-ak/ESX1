import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Company from "@/models/Company";

export async function GET() {
  await dbConnect();
  const companies = await Company.find().lean();
  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.name || !body?.industry || !body?.country || body.revenue == null) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await dbConnect();
  const company = await Company.create(body);
  return NextResponse.json(company, { status: 201 });
}
