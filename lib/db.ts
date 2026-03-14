// lib/db.ts
import { INIT_EMPLOYEES } from "@/constants/page";

// In-memory stores
let employees = [...INIT_EMPLOYEES];
let departments = [
  {
    id: "d1",
    name: "Executive",
    code: "EXEC",
    description: "Leadership",
    budget: 500000,
  },
  {
    id: "d2",
    name: "Human Resources",
    code: "HR",
    description: "People operations",
    budget: 200000,
  },
  {
    id: "d3",
    name: "Engineering",
    code: "ENG",
    description: "Product development",
    budget: 800000,
  },
];
let payrolls: any[] = [];

export const getEmployees = () => employees;
export const getEmployeeByEmail = (email: string) =>
  employees.find((e) => e.email === email);
export const createEmployee = (emp: any) => {
  const newEmp = {
    ...emp,
    id: `e${Date.now()}`,
    employeeId: `EMP-${String(employees.length + 1).padStart(4, "0")}`,
  };
  employees.push(newEmp);
  return newEmp;
};
export const updateEmployee = (id: string, data: any) => {
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...data };
  return employees[index];
};
export const deleteEmployee = (id: string) => {
  employees = employees.filter((e) => e.id !== id);
};

export const getDepartments = () => departments;
export const createDepartment = (dept: any) => {
  const newDept = { ...dept, id: `d${Date.now()}` };
  departments.push(newDept);
  return newDept;
};

export const getPayrolls = () => payrolls;
export const addPayrolls = (newPayrolls: any[]) => {
  payrolls = [...payrolls, ...newPayrolls];
};

// Auth
export const findUserByEmail = (email: string) =>
  employees.find((e) => e.email === email);
