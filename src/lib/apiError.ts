import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }
  console.error(err);
  // TEMPORARY: surfacing the real error message/name in the response body to
  // debug a production issue where Vercel's log UI wasn't showing the actual
  // error text. Revert to a generic message once the root cause is found.
  const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  return NextResponse.json({ error: `Something went wrong. Please try again. [DEBUG: ${detail}]` }, { status: 500 });
}
