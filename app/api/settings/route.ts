import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("GET /api/settings supabase error", error.message || error);
      // If the table does not exist or other recoverable error, return an empty object
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(data ?? {});
  } catch (err: any) {
    console.error("GET /api/settings unexpected error", err?.message ?? err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    // First, check if a settings record exists
    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .limit(1)
      .single();

    let result;
    
    if (existing?.id) {
      // Update existing record
      const { data, error } = await supabase
        .from("site_content")
        .update(body)
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) {
        console.error("PUT /api/settings update error", error.message || error);
        return NextResponse.json(
          { error: "Error updating settings", details: error.message },
          { status: 500 },
        );
      }
      result = data;
    } else {
      // Insert new record with id = 1
      const { data, error } = await supabase
        .from("site_content")
        .insert({ ...body, id: 1 })
        .select()
        .single();
      
      if (error) {
        console.error("PUT /api/settings insert error", error.message || error);
        return NextResponse.json(
          { error: "Error creating settings", details: error.message },
          { status: 500 },
        );
      }
      result = data;
    }

    return NextResponse.json(result ?? {});
  } catch (err: any) {
    console.error("PUT /api/settings unexpected error", err?.message ?? err);
    return NextResponse.json({ error: "Unexpected error", details: err?.message }, { status: 500 });
  }
}
