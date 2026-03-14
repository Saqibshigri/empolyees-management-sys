// lib/auth.ts
// In a real app, use bcrypt. For demo, plain text (since initial passwords are plain)
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt.hash
  return password; // not secure, just for demo
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  // In production, use bcrypt.compare
  return password === hash;
}
