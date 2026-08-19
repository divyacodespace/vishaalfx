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
  // eslint-disable-next-line no-console
  console.error(err);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
