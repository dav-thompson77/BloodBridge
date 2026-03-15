import { NextResponse, type NextRequest } from "next/server";

function twimlMessage(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`;
}

export async function POST(request: NextRequest) {
  try {
    // Twilio sends form-url-encoded payloads for messaging webhooks.
    await request.formData();
  } catch {
    return new NextResponse(twimlMessage("Invalid SMS webhook payload."), {
      status: 400,
      headers: { "Content-Type": "application/xml" },
    });
  }

  return new NextResponse(
    twimlMessage(
      "Thanks for your reply. Please continue in the Blood Bridge donor app for booking and status updates.",
    ),
    {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    },
  );
}
