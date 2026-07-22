import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/auth-middleware";
import { supabaseAdmin } from "@/integrations/client.server";

type Booking = {
  id: string;
  service: string;
  vehicle: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  email: string;
  phone: string;
  notes: string | null;
  estimated_price: number | null;
  status: string;
  created_at: string;
  user_id: string | null;
};

export const getMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Booking[];
  });
