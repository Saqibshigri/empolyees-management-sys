 // constants/page.ts
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const STATUS_CFG: Record<string, { label: string; dot: string }> = {
  ACTIVE: { label: "Active", dot: "#4ade80" },
  ON_LEAVE: { label: "On Leave", dot: "#fb923c" },
  TERMINATED: { label: "Terminated", dot: "#f87171" },
  PROBATION: { label: "Probation", dot: "#60a5fa" },
};

export const ROLE_CFG: Record<string, { label: string }> = {
  SUPER_ADMIN: { label: "Super Admin" },
  ADMIN: { label: "Admin" },
  HR_MANAGER: { label: "HR Manager" },
  MANAGER: { label: "Manager" },
  EMPLOYEE: { label: "Employee" },
};

// For Dashboard chart
export const HEADCOUNT = [
  { month: "Jan", count: 42 },
  { month: "Feb", count: 45 },
  { month: "Mar", count: 48 },
  { month: "Apr", count: 52 },
  { month: "May", count: 55 },
  { month: "Jun", count: 58 },
];

export const CHART_COLORS = ["#d4a853", "#60a5fa", "#4ade80", "#fb923c", "#c084fc", "#22d3ee"];

// Initial employees for demo
export const INIT_EMPLOYEES = [
  {
    id: "e1",
    employeeId: "EMP-0001",
    firstName: "Alex",
    lastName: "Morgan",
    email: "admin@ems.com",
    password: "admin123",
    phone: "+1-555-0100",
    gender: "MALE",
    city: "New York",
    country: "USA",
    salary: 120000,
    status: "ACTIVE",
    departmentId: "d1",
    designation: "CTO",
    role: "SUPER_ADMIN",
    hireDate: "2023-01-15",
  },
  {
    id: "e2",
    employeeId: "EMP-0002",
    firstName: "Jordan",
    lastName: "Lee",
    email: "hr@ems.com",
    password: "hr123",
    phone: "+1-555-0101",
    gender: "FEMALE",
    city: "San Francisco",
    country: "USA",
    salary: 95000,
    status: "ACTIVE",
    departmentId: "d2",
    designation: "HR Lead",
    role: "HR_MANAGER",
    hireDate: "2023-03-20",
  },
  {
    id: "e3",
    employeeId: "EMP-0003",
    firstName: "Taylor",
    lastName: "Smith",
    email: "manager@ems.com",
    password: "mgr123",
    phone: "+1-555-0102",
    gender: "MALE",
    city: "Austin",
    country: "USA",
    salary: 105000,
    status: "ACTIVE",
    departmentId: "d3",
    designation: "Engineering Manager",
    role: "MANAGER",
    hireDate: "2023-06-10",
  },
  {
    id: "e4",
    employeeId: "EMP-0004",
    firstName: "Casey",
    lastName: "Jones",
    email: "emp@ems.com",
    password: "emp123",
    phone: "+1-555-0103",
    gender: "OTHER",
    city: "Chicago",
    country: "USA",
    salary: 75000,
    status: "ACTIVE",
    departmentId: "d3",
    designation: "Developer",
    role: "EMPLOYEE",
    hireDate: "2024-02-01",
  },
];