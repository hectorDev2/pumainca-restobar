import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: p, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, description, image_url),
      subcategory:subcategories(id, name, description),
      prices:product_prices(size_name, price),
      ingredients:product_ingredients(ingredient_name),
      allergens:product_allergens(allergen_name),
      gallery:product_gallery(image_url, display_order)
    `)
    .eq("id", id)
    .single();

  if (error || !p) {
    return NextResponse.json(
      { statusCode: 404, message: "Not found" },
      { status: 404 }
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
    image: p.image_url,
    imageUrl: p.image_url,
    prices: p.prices,
    ingredients: p.ingredients.map((i: any) => i.ingredient_name),
    allergens: p.allergens.map((a: any) => a.allergen_name),
    gallery: p.gallery,
    created_at: p.created_at,
    updated_at: p.updated_at,
    // CamelCase aliases
    isVegetarian: p.is_vegetarian,
    isSpicy: p.is_spicy,
    isGlutenFree: p.is_gluten_free,
    isChefSpecial: p.is_chef_special,
    isRecommended: p.is_recommended
  };

  return NextResponse.json(mappedData);
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
        updates.subcategory_id = subcategory_id === "" ? null : String(subcategory_id);
    }

    const priceRaw = formData.get("price");
    if (priceRaw !== null) {
        updates.price = Number(priceRaw);
    }

    // Booleans
    const boolFields = [
        "is_variable_price", "is_available", "is_vegetarian", "is_spicy", 
        "is_gluten_free", "is_chef_special", "is_recommended"
    ];
    
    for (const f of boolFields) {
        const v = formData.get(f);
        if (v !== null) {
            const s = String(v).toLowerCase();
            updates[f] = s === 'true' || s === '1' || s === 'on';
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
        const fileName = `${Date.now()}-${sanitizeFileName(updates.name || id)}.${ext}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('menu').upload(filePath, buffer);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('menu').getPublicUrl(filePath);
        updates.image_url = publicUrlData.publicUrl;
    }

    const { data: updated, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (updateError) throw updateError;
    
    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
