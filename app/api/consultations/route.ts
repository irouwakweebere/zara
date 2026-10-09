import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

const allowedGoals = new Set([
  "Breakouts",
  "Dryness or sensitivity",
  "Uneven tone or texture",
  "Building a routine",
  "Something else",
]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return Response.json({ error: "That request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid consultation request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Please send a valid consultation request." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const name = isString(values.name) ? values.name.trim() : "";
  const email = isString(values.email) ? values.email.trim().toLowerCase() : "";
  const goal = isString(values.goal) ? values.goal : "";
  const concerns = isString(values.concerns) ? values.concerns.trim() : "";

  if (isString(values.website) && values.website.trim()) {
    return Response.json({ received: true });
  }

  if (name.length < 2 || name.length > 80) {
    return Response.json({ error: "Please enter a name between 2 and 80 characters." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!allowedGoals.has(goal)) {
    return Response.json({ error: "Please choose what you would like help with." }, { status: 400 });
  }
  if (concerns.length > 800) {
    return Response.json({ error: "Please keep your note under 800 characters." }, { status: 400 });
  }
  if (values.consent !== "true" && values.consent !== true) {
    return Response.json({ error: "Please agree to be contacted about your request." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const notificationEmail = process.env.CONSULTATION_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !from || !notificationEmail) {
    return Response.json({ error: "Consultation email delivery isn't configured yet." }, { status: 503 });
  }

  const entry = {
    id: randomUUID(),
    name,
    email,
    goal,
    concerns,
    createdAt: new Date().toISOString(),
  };

  try {
    const dataDirectory = path.join(process.cwd(), "data");
    await mkdir(dataDirectory, { recursive: true });
    await appendFile(path.join(dataDirectory, "consultations.jsonl"), `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    return Response.json({ error: "We couldn't save your request just now. Please try again shortly." }, { status: 500 });
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: notificationEmail,
      replyTo: email,
      subject: "New consultation request",
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Goal: ${goal}`,
        `Additional notes: ${concerns || "None"}`,
        `Received: ${entry.createdAt}`,
      ].join("\n"),
    });

    if (error) {
      return Response.json({ error: "We couldn't send your request right now. Please try again shortly." }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "We couldn't send your request right now. Please try again shortly." }, { status: 502 });
  }

  return Response.json({ received: true }, { status: 201 });
}