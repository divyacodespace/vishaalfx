import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function hashSecret(value: string): Promise<string> {
  return bcrypt.hash(value, 10);
}

export async function compareSecret(value: string, hash: string): Promise<boolean> {
  return bcrypt.compare(value, hash);
}

export function sha256Hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateAgreementId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `VFX-${stamp}-${rand}`;
}
