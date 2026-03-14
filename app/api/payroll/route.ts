import { NextResponse } from "next/server";
import { getPayrolls, addPayrolls } from "@/lib/db";

export async function GET() {
  const payrolls = getPayrolls();
  return NextResponse.json(payrolls);
}

export async function POST(request: Request) {
  try {
    const { month, year } = await request.json();
    // In a real app, you'd generate payroll for employees
    // For demo, we'll just return a success message
    // You could call a generation function from db
    return NextResponse.json(
      { message: "Payroll generation triggered", month, year },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
