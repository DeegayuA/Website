import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "node:crypto";

/**
 * GitHub push webhook → refresh the cached GitHub data immediately.
 *
 * Point a repo (or org) webhook at POST /api/revalidate with content type
 * application/json and a secret matching GITHUB_WEBHOOK_SECRET. Every push
 * then invalidates the "github" fetch cache and the home page, so commit
 * maps update on the next visit instead of waiting for the weekly ISR pass.
 */
export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "GITHUB_WEBHOOK_SECRET is not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(body).digest("hex");

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  revalidateTag("github", "max");
  revalidatePath("/");
  return NextResponse.json({ revalidated: true });
}
