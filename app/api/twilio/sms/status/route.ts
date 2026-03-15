import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Accept and ignore for now; this endpoint prevents Twilio callback failures.
    await request.formData();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
