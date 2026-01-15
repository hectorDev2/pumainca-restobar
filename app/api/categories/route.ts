import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type CategoryRecord = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  subcategories: any[];
};

const DATA_FILE = path.join(process.cwd(), "data", "categories.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

async function readCategories(): Promise<CategoryRecord[]> {
  try {
    const txt = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(txt) as CategoryRecord[];
  } catch (err) {
    return [];
  }
}

async function writeCategories(list: CategoryRecord[]) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: ["Content-Type must be multipart/form-data"],
        error: "Bad Request",
      },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const name = String(formData.get("name") || "").trim();
  const description = formData.get("description")
    ? String(formData.get("description"))
    : undefined;
  const imageField = formData.get("image") as File | null;
  const imageUrlField = formData.get("image_url")
    ? String(formData.get("image_url"))
    : undefined;
  const displayOrderRaw = formData.get("display_order");

  if (!name) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: ["name should not be empty"],
        error: "Bad Request",
      },
      { status: 400 }
    );
  }

  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) || 0 : 0;

  const categories = await readCategories();

  // Prevent creating duplicate categories by name (case-insensitive)
  const nameNormalized = name.trim().toLowerCase();
  const duplicate = categories.find(
    (c) => String(c.name || "").trim().toLowerCase() === nameNormalized
  );

  if (duplicate) {
    return NextResponse.json(
      {
        statusCode: 409,
        message: ["Ya existe una categoría con ese nombre"],
        error: "Conflict",
      },
      { status: 409 }
    );
  }

  let savedImageUrl: string | null = null;

  // If an image file is provided, save to public/uploads
  if (imageField && (imageField as any).size) {
    await ensureUploadsDir();
    try {
      const file = imageField as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(file.name) || ".jpg";
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      await fs.writeFile(filePath, buffer);
      savedImageUrl = `/uploads/${fileName}`;
    } catch (err) {
      console.error("Error saving image", err);
      return NextResponse.json(
        { statusCode: 500, message: "Error saving image" },
        { status: 500 }
      );
    }
  } else if (imageUrlField) {
    savedImageUrl = imageUrlField;
  }

  // Generate an id (slug-like)
  const id =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `cat-${Date.now()}`;

  const now = new Date().toISOString();

  const newCategory: CategoryRecord = {
    id,
    name,
    description,
    imageUrl: savedImageUrl ?? null,
    displayOrder: displayOrder ?? 0,
    createdAt: now,
    updatedAt: now,
    subcategories: [],
  };

  categories.push(newCategory);
  await writeCategories(categories);

  return NextResponse.json(newCategory);
}

export async function GET() {
  const categories = await readCategories();
  return NextResponse.json(categories);
}
