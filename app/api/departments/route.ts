import { NextResponse } from "next/server";
import { getDepartments, createDepartment } from "@/lib/db";

export async function GET() {
  const departments = getDepartments();
  return NextResponse.json(departments);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Basic validation
    if (!data.name || !data.code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 },
      );
    }
    const newDept = createDepartment({
      ...data,
      budget: Number(data.budget) || 0,
    });
    return NextResponse.json(newDept, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
