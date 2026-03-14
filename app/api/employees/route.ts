import { NextResponse } from "next/server";
import { getEmployees } from "@/lib/db";

export async function GET() {
  const employees = getEmployees();
  // Remove passwords before sending
  const safe = employees.map(({ password, ...rest }) => rest);
  return NextResponse.json(safe);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // You would normally validate and add to DB
    // For now, return a mock response
    return NextResponse.json(
      { message: "Employee created", employee: data },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
