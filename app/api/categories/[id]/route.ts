import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contentType = req.headers.get("content-type") || "";
  
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Content-Type must be multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const updates: any = { updated_at: new Date().toISOString() };

    // Get current category info
    const { data: currentCategory } = await supabase
      .from('categories')
      .select('name, image_url')
      .eq('id', id)
      .single();

    if (!currentCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const name = formData.get("name");
    if (name !== null) {
      const nameStr = String(name).trim();
      if (!nameStr) {
        return NextResponse.json(
          { message: ["name should not be empty"] },
          { status: 400 }
        );
      }

      // Check for duplicates (excluding current category)
      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", nameStr)
        .neq("id", id)
        .single();

      if (existing) {
        return NextResponse.json(
          { message: ["Ya existe una categoría con ese nombre"] },
          { status: 409 }
        );
      }

      updates.name = nameStr;
    }

    const description = formData.get("description");
    if (description !== null) {
      updates.description = description === "" ? null : String(description);
    }

    const displayOrder = formData.get("display_order");
    if (displayOrder !== null) {
      updates.display_order = Number(displayOrder);
    }

    // Handle image upload
    const imageField = formData.get("image") as File | null;
    if (imageField && (imageField as any).size) {
      const file = imageField as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop() || "jpg";
      
      const categoryName = updates.name || currentCategory.name;
      const fileName = `${Date.now()}-${sanitizeFileName(categoryName)}.${ext}`;
      const filePath = `categories/${fileName}`;

      // Delete old image from storage if it exists
      if (currentCategory.image_url) {
        try {
          const oldImageUrl = currentCategory.image_url;
          const urlParts = oldImageUrl.split('/storage/v1/object/public/menu/');
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[1];
            await supabase.storage
              .from("menu")
              .remove([oldFilePath]);
          }
        } catch (deleteError) {
          console.error('Error deleting old category image:', deleteError);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("menu")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu")
        .getPublicUrl(filePath);

      updates.image_url = publicUrlData.publicUrl;
    }

    // Update category
    const { data: updated, error: updateError } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (productsError) {
      throw productsError;
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        { 
          message: "Cannot delete category with existing products",
          error: "Conflict" 
        },
        { status: 409 }
      );
    }

    // Get category info to retrieve image URL
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError || !category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Delete associated image from storage if exists
    if (category.image_url) {
      try {
        const imageUrl = category.image_url;
        const urlParts = imageUrl.split('/storage/v1/object/public/menu/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage
            .from("menu")
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error('Error deleting category image:', storageError);
      }
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      message: "Category deleted successfully",
      id
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
