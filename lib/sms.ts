export async function sendSMS(_to: string, _body: string): Promise<boolean> {
  void _to;
  void _body;
  // SMS delivery is optional for this monitor flow in cloud demos.
  // In-app alerts remain the primary guaranteed channel.
  return false;
}

export function buildSMSMessages({
  donorName,
  bloodType,
  centreName,
  requiredBy,
  donorStatus,
  lastDonationDate,
  staffNote,
}: {
  donorName: string;
  bloodType: string;
  centreName: string;
  requiredBy: string;
  donorStatus: string;
  lastDonationDate: string | null;
  staffNote: string | null;
}) {
  const donationNote = lastDonationDate
    ? `Your last donation was on ${new Date(lastDonationDate).toLocaleDateString("en-JM", { day: "numeric", month: "short", year: "numeric" })}.`
    : "No previous donation date is on file.";

  const noteText = staffNote ? `Note from staff: ${staffNote}` : "";

  const urgent = `URGENT OUTREACH\nGood day ${donorName}, urgent hospital support needed for ${bloodType} donors at ${centreName}, needed by ${new Date(requiredBy).toLocaleDateString("en-JM", { day: "numeric", month: "short", year: "numeric" })}. You are currently marked as ${donorStatus} to donate. ${donationNote} Please reply in Blood Bridge if you are available.`;

  const reminder = `Hello ${donorName}, we are coordinating a critical request for ${bloodType} at ${centreName} in Jamaica. You are currently marked as ${donorStatus} to donate. ${noteText} Please log in to Blood Bridge to respond.`;

  const followUp = `Blood Bridge update for ${bloodType} needed at ${centreName}. Required by ${new Date(requiredBy).toLocaleDateString("en-JM", { day: "numeric", month: "short", year: "numeric" })}. ${donationNote} Please mark Interested, Booked, or Unavailable in your dashboard so hospital staff can plan safely.`;

  return { urgent, reminder, followUp };
}
