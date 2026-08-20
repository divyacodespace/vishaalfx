import { prisma } from "./db";

export async function logAudit(params: {
  userId?: string | null;
  actorType: "student" | "admin" | "system";
  actorId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId ?? undefined,
      actorType: params.actorType,
      actorId: params.actorId ?? undefined,
      action: params.action,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
      ipAddress: params.ipAddress ?? undefined,
    },
  });
}

export function getClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers.get("x-real-ip");
}
