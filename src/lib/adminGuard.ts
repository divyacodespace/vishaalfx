import { getAdminSession } from "./adminAuth";
import { ApiError } from "./apiError";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new ApiError(401, "Admin authentication required.", "NOT_AUTHENTICATED");
  }
  return session;
}
