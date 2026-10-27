import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { appendFile } from "node:fs/promises";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Please send a valid assessment form." }, { status: 400 });
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const emailAddress = String(formData.get("emailAddress") ?? "").trim().toLowerCase();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress) || phoneNumber.length < 7 || !formData.get("consent")) {
    return Response.json({ error: "Please complete the required contact fields and consent." }, { status: 400 });
  }

  const values: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    const existing = values[key];
    if (existing === undefined) values[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else values[key] = [existing, value];
  }

  const id = randomUUID();
  const uploadDirectory = path.join(process.cwd(), "data", "skin-assessment-uploads", id);
  const photoNames: string[] = [];
  for (const value of formData.getAll("photos")) {
    if (!(value instanceof File) || value.size === 0) continue;
    if (value.size > 5 * 1024 * 1024 || !value.type.startsWith("image/")) {
      return Response.json({ error: "Photos must be images smaller than 5 MB each." }, { status: 413 });
    }
    await mkdir(uploadDirectory, { recursive: true });
    const extension = path.extname(value.name || "").slice(0, 10) || ".jpg";
    const safeName = `${photoNames.length + 1}${extension}`;
    await writeFile(path.join(uploadDirectory, safeName), Buffer.from(await value.arrayBuffer()));
    photoNames.push(safeName);
  }

  const entry = { id, createdAt: new Date().toISOString(), ...values, photos: photoNames };
  try {
    await mkdir(path.join(process.cwd(), "data"), { recursive: true });
    await appendFile(path.join(process.cwd(), "data", "skin-assessments.jsonl"), `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    return Response.json({ error: "We couldn't save your assessment right now." }, { status: 500 });
  }

  return Response.json({ received: true, id }, { status: 201 });
}
