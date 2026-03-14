// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail, createEmployee } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }
    const hashed = await hashPassword(password); // for demo, still plain
    const newEmp = createEmployee({
      firstName,
      lastName,
      email,
      password: hashed,
      phone: "",
      gender: "OTHER",
      city: "",
      country: "",
      salary: 0,
      status: "ACTIVE",
      departmentId: "",
      designation: "",
      role: "EMPLOYEE",
      hireDate: new Date().toISOString().split("T")[0],
    });
    const { password: _, ...safeUser } = newEmp;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
