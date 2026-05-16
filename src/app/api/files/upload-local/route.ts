import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { withAuth, AuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const POST = withAuth(async (req: Request, user: AuthUser) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const conferenceId = formData.get("conferenceId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueId = randomUUID();
    const filename = `${uniqueId}-${file.name.replace(/\s+/g, "_")}`;
    const publicPath = path.join(process.cwd(), "public", "uploads", filename);

    // Write file to public/uploads
    await writeFile(publicPath, buffer);

    const fileUrl = `/uploads/${filename}`;

    const finalConferenceId = (conferenceId && conferenceId !== "undefined" && conferenceId !== "null" && conferenceId !== "") 
      ? conferenceId 
      : null;

    // Create DB record with ultimate fallback
    let dbFile;
    try {
      dbFile = await prisma.file.create({
        data: {
          name: file.name,
          url: fileUrl,
          userId: user.id,
          conferenceId: finalConferenceId,
          isSelected: true,
        },
      });
    } catch (dbError: any) {
      console.warn("[DB_CREATE_FALLBACK]: Attempting save without isSelected", dbError.message);
      // Fallback: try without the potentially problematic isSelected field
      dbFile = await prisma.file.create({
        data: {
          name: file.name,
          url: fileUrl,
          userId: user.id,
          conferenceId: finalConferenceId,
        },
      });
    }

    return NextResponse.json({ file: dbFile });
  } catch (error: any) {
    console.error("[LOCAL_UPLOAD_ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
