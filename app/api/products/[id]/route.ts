import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data: p, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, description, image_url),
      subcategory:subcategories(id, name, description),
      prices:product_prices(size_name, price),
      ingredients:product_ingredients(ingredient_name),
      allergens:product_allergens(allergen_name),
      gallery:product_gallery(image_url, display_order)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !p) {
    return NextResponse.json(
      { statusCode: 404, message: "Not found" },
      { status: 404 },
    );
  }

  const mappedData = {
    id: p.id,
    name: p.name,
    description: p.description,
    category_id: p.category_id,
    subcategory_id: p.subcategory_id,
    image_url: p.image_url,
    price: p.price,
    is_variable_price: p.is_variable_price,
    is_available: p.is_available,
    is_vegetarian: p.is_vegetarian,
    is_spicy: p.is_spicy,
    is_gluten_free: p.is_gluten_free,
    is_chef_special: p.is_chef_special,
    is_recommended: p.is_recommended,
    preparation_time_minutes: p.preparation_time_minutes,
    display_order: p.display_order,
    category: p.category,
    prices: p.prices,
    ingredients: p.ingredients.map((i: any) => i.ingredient_name),
    allergens: p.allergens.map((a: any) => a.allergen_name),
    gallery: p.gallery,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };

  return NextResponse.json(mappedData);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Content-Type must be multipart/form-data" },
      { status: 400 },
    );
  }

  try {
    const formData = await req.formData();

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() };
    const maybe = (key: string) => {
      const v = formData.get(key);
      return v === null ? undefined : String(v);
    };

    const name = maybe("name");
    if (name) updates.name = name;

    const description = maybe("description");
    if (description) updates.description = description;

    const category_id = maybe("category_id") || maybe("category");
    if (category_id) updates.category_id = category_id;

    const subcategory_id = formData.get("subcategory_id");
    if (subcategory_id !== null) {
      updates.subcategory_id =
        subcategory_id === "" ? null : String(subcategory_id);
    }

    const priceRaw = formData.get("price");
    if (priceRaw !== null) {
      updates.price = Number(priceRaw);
    }

    // Booleans
    const boolFields = [
      "is_variable_price",
      "is_available",
      "is_vegetarian",
      "is_spicy",
      "is_gluten_free",
      "is_chef_special",
      "is_recommended",
    ];

    for (const f of boolFields) {
      const v = formData.get(f);
      if (v !== null) {
        const s = String(v).toLowerCase();
        updates[f] = s === "true" || s === "1" || s === "on";
      }
    }

    const prep = formData.get("preparation_time_minutes");
    if (prep !== null) updates.preparation_time_minutes = Number(prep);

    const displayOrder = formData.get("display_order");
    if (displayOrder !== null) updates.display_order = Number(displayOrder);

    // Image Upload
    const imageField = formData.get("image") as File | null;
    if (imageField && (imageField as any).size) {
      const file = imageField as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop() || "jpg";

      // Fetch current product info to get old image URL and name
      const { data: currentProduct } = await supabase
        .from("products")
        .select("name, image_url, category_id")
        .eq("id", id)
        .single();

      let productName = updates.name || currentProduct?.name || id;
      const fileName = `${sanitizeFileName(productName)}.${ext}`;

      let folderName = "uncategorized";
      let targetCategoryId = category_id || currentProduct?.category_id;

      if (targetCategoryId) {
        const { data: cat } = await supabase
          .from("categories")
          .select("name")
          .eq("id", targetCategoryId)
          .single();
        if (cat?.name) {
          folderName = sanitizeFileName(cat.name);
        }
      }

      const filePath = `products/${folderName}/${fileName}`;

      // Delete old image from storage if it exists
      if (currentProduct?.image_url) {
        try {
          const oldImageUrl = currentProduct.image_url;
          // Extract file path from the public URL
          const urlParts = oldImageUrl.split("/storage/v1/object/public/menu/");
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[1];
            await supabase.storage.from("menu").remove([oldFilePath]);
          }
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
          // Continue with upload even if deletion fails
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true, // Changed to true to allow replacing if it exists
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu")
        .getPublicUrl(filePath);

      updates.image_url = publicUrlData.publicUrl;
    }

    const { data: updated, error: updateError } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // Get product info including main image and gallery images
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image_url, gallery:product_gallery(image_url)")
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const imagesToDelete: string[] = [];

    // Add main image to deletion list
    if (product.image_url) {
      const urlParts = product.image_url.split(
        "/storage/v1/object/public/menu/",
      );
      if (urlParts.length > 1) {
        imagesToDelete.push(urlParts[1]);
      }
    }

    // Add gallery images to deletion list
    if (product.gallery && Array.isArray(product.gallery)) {
      for (const galleryImage of product.gallery) {
        if (galleryImage.image_url) {
          const urlParts = galleryImage.image_url.split(
            "/storage/v1/object/public/menu/",
          );
          if (urlParts.length > 1) {
            imagesToDelete.push(urlParts[1]);
          }
        }
      }
    }

    // Delete all images from storage
    if (imagesToDelete.length > 0) {
      try {
        await supabase.storage.from("menu").remove(imagesToDelete);
      } catch (storageError) {
        console.error("Error deleting product images:", storageError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product (this will cascade delete related records if FK constraints are set up properly)
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      message: "Product deleted successfully",
      id,
      deletedImages: imagesToDelete.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
