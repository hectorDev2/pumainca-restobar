import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/imagekit";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    const fileName = (formData.get("fileName") as string) || "upload";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadImage(file, fileName, folder);

    return NextResponse.json({ url });
  } catch (error) {
    const err: any = error;
    console.error("Upload error:", {
      message: err?.message,
      name: err?.name,
      status: err?.response?.status,
      stack: err?.stack?.split("\n")?.slice(0, 6),
    });
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
