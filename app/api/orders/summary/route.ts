
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Get summary stats
  // We need to count orders by status, total revenue, etc.
  
  // Total Orders
  const { count: totalOrders, error: errTotal } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  if (errTotal) return NextResponse.json({ error: errTotal.message }, { status: 500 });

  // Status counts
  const { data: statusCounts, error: errStatus } = await supabase
    .from("orders")
    .select("status");

  // Revenue (completed orders)
  const { data: revenueData, error: errRevenue } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "completed");

  const revenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;

  // Simple aggregation manually since Supabase doesn't support complex GROUP BY via client easily without RPC
  const pending = statusCounts?.filter(o => o.status === 'pending').length || 0;
  const preparing = statusCounts?.filter(o => o.status === 'preparing').length || 0;
  const ready = statusCounts?.filter(o => o.status === 'ready').length || 0;
  const completed = statusCounts?.filter(o => o.status === 'completed').length || 0;
  const cancelled = statusCounts?.filter(o => o.status === 'cancelled').length || 0;

  return NextResponse.json({
    totalOrders,
    revenue,
    statusBreakdown: {
        pending,
        preparing,
        ready,
        completed,
        cancelled
    }
  });
}
