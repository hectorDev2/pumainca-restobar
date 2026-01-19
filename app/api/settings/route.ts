import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("settings").select("*").limit(1).single();

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
    // Try to upsert settings. If the DB/table isn't present this may fail;
    // we catch errors and return a safe 500 with details in logs.
    const { data, error } = await supabase.from("settings").upsert(body).select().single();

    if (error) {
      console.error("PUT /api/settings supabase error", error.message || error);
      return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
    }

    return NextResponse.json(data ?? {});
  } catch (err: any) {
    console.error("PUT /api/settings unexpected error", err?.message ?? err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
