import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create departments
  const execDept = await prisma.department.upsert({
    where: { code: "EXEC" },
    update: {},
    create: {
      name: "Executive",
      code: "EXEC",
      description: "Leadership",
      budget: 500000,
    },
  });
  const hrDept = await prisma.department.upsert({
    where: { code: "HR" },
    update: {},
    create: {
      name: "Human Resources",
      code: "HR",
      description: "People operations",
      budget: 200000,
    },
  });
  const engDept = await prisma.department.upsert({
    where: { code: "ENG" },
    update: {},
    create: {
      name: "Engineering",
      code: "ENG",
      description: "Product development",
      budget: 800000,
    },
  });

  // Create default admin user
  await prisma.employee.upsert({
    where: { email: "admin@ems.com" },
    update: {},
    create: {
      employeeId: "EMP-0001",
      firstName: "Alex",
      lastName: "Morgan",
      email: "admin@ems.com",
      password: "admin123", // in production, hash the password!
      phone: "+1-555-0100",
      gender: "MALE",
      city: "New York",
      country: "USA",
      salary: 120000,
      status: "ACTIVE",
      departmentId: execDept.id,
      designation: "CTO",
      role: "SUPER_ADMIN",
      hireDate: new Date("2023-01-15"),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
