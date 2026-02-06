
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, "_");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");

    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name, description, image_url),
        subcategory:subcategories(id, name, description),
        prices:product_prices(size_name, price),
        ingredients:product_ingredients(ingredient_name),
        allergens:product_allergens(allergen_name),
        gallery:product_gallery(image_url, display_order)
      `);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort) {
      if (sort === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (sort === "price_desc") {
        query = query.order("price", { ascending: false });
      } else if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "recommended") {
        query = query.order("is_recommended", { ascending: false }).order("display_order", { ascending: true });
      }
    } else {
      query = query.order("display_order", { ascending: true });
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Error fetching products", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
        return NextResponse.json([]);
    }

    // Map to frontend expected structure
    const mappedData = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category_id: p.category_id,
      subcategory_id: p.subcategory_id,
      image_url: p.image_url,
      price: p.price, // Base price
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
      prices: p.prices, // [{size_name, price}]
      ingredients: (p.ingredients || []).map((i: any) => i.ingredient_name), // Flatten to array of strings
      allergens: (p.allergens || []).map((a: any) => a.allergen_name),
      gallery: p.gallery,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));

    return NextResponse.json(mappedData);
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Content-Type must be multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "").trim();
    if (!name) throw new Error("Name is required");

    const description = formData.get("description") as string;
    const priceRaw = formData.get("price");
    const categoryId = formData.get("category_id") as string;
    const subcategoryId = formData.get("subcategory_id") as string;
    
    // Booleans
    const getBool = (key: string) => {
        const v = formData.get(key);
        return v === 'true' || v === '1' || v === 'on';
    };

    const isVariablePrice = getBool("is_variable_price");
    const isAvailable = formData.get("is_available") !== null ? getBool("is_available") : true;

    // Image Upload
    let savedImageUrl: string | null = null;
    const imageField = formData.get("image") as File | null;
    
    if (imageField && (imageField as any).size) {
        const file = imageField as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split(".").pop() || "jpg";
        
        // Determinar carpeta basada en categoría o default 'uncategorized'
        let folderName = "uncategorized";
        if (categoryId) {
            const { data: cat } = await supabase
                .from('categories')
                .select('name')
                .eq('id', categoryId)
                .single();
            if (cat?.name) {
                folderName = sanitizeFileName(cat.name);
            }
        }
        
        const fileName = `${sanitizeFileName(name)}.${ext}`;
        const filePath = `products/${folderName}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from("menu")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
             throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from("menu")
            .getPublicUrl(filePath);

        savedImageUrl = publicUrlData.publicUrl;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `prod-${Date.now()}`;
    const price = priceRaw ? Number(priceRaw) : 0;

    // Insert Product
    const { data: newOk, error: insertError } = await supabase.from('products').insert({
        id,
        name,
        description,
        category_id: categoryId,
        subcategory_id: subcategoryId || null,
        image_url: savedImageUrl,
        price,
        is_variable_price: isVariablePrice,
        is_available: isAvailable,
        is_vegetarian: getBool("is_vegetarian"),
        is_spicy: getBool("is_spicy"),
        is_gluten_free: getBool("is_gluten_free"),
        is_chef_special: getBool("is_chef_special"),
        is_recommended: getBool("is_recommended"),
        preparation_time_minutes: Number(formData.get("preparation_time_minutes")) || 15
    }).select().single();

    if (insertError) throw insertError;

    return NextResponse.json(newOk);

  } catch (err: any) {
    console.error("[POST /api/products] Error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
