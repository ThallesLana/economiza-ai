import * as bcrypt from 'bcrypt';
import * as process from 'node:process';

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
