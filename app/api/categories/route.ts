import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .order("display_order");

  if (error) {
    return NextResponse.json(
      { error: "Error fetching categories", details: error.message },
      { status: 500 }
    );
  }

  // Map Supabase response to match expected frontend structure if needed
  // The frontend expects camelCase keys? JSON is usually camelCase.
  // The DB tables are snake_case.
  // We should transform keys to camelCase to maintain compatibility with the frontend.

  const mappedData = data.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    imageUrl: cat.image_url,
    displayOrder: cat.display_order,
    createdAt: cat.created_at,
    updatedAt: cat.updated_at,
    subcategories: cat.subcategories.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      displayOrder: sub.display_order,
    })),
  }));

  return NextResponse.json(mappedData);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      {
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
      { message: ["name should not be empty"], error: "Bad Request" },
      { status: 400 }
    );
  }

  // Duplicate check
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", name)
    .single();

  if (existing) {
    return NextResponse.json(
      { message: ["Ya existe una categoría con ese nombre"], error: "Conflict" },
      { status: 409 }
    );
  }

  let savedImageUrl: string | null = null;
  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) || 0 : 0;

  // Upload Image
  if (imageField && (imageField as any).size) {
    try {
      const file = imageField as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${sanitizeFileName(name)}.${ext}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu")
        .getPublicUrl(filePath);

      savedImageUrl = publicUrlData.publicUrl;
    } catch (err: any) {
      console.error("Error saving image", err);
      return NextResponse.json(
        { message: "Error saving image", details: err.message },
        { status: 500 }
      );
    }
  } else if (imageUrlField) {
    savedImageUrl = imageUrlField;
  }

  const id =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `cat-${Date.now()}`;

  const { data: newCategory, error: insertError } = await supabase
    .from("categories")
    .insert({
      id,
      name,
      description,
      image_url: savedImageUrl,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { message: "Error creating category", details: insertError.message },
      { status: 500 }
    );
  }

  // Map response back to camelCase
  const mappedResponse = {
    id: newCategory.id,
    name: newCategory.name,
    description: newCategory.description,
    imageUrl: newCategory.image_url,
    displayOrder: newCategory.display_order,
    createdAt: newCategory.created_at,
    updatedAt: newCategory.updated_at,
    subcategories: [], // New category has no subcategories
  };

  return NextResponse.json(mappedResponse);
}
