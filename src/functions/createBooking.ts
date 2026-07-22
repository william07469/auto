import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/auth-middleware";
import { supabaseAdmin } from "@/integrations/client.server";

type BookingInput = {
  service: string;
  vehicle: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  email: string;
  phone: string;
  notes: string | null;
  estimated_price: number | null;
};

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: BookingInput) => input)
  .handler(async ({ context, data }) => {
    const { userId } = context;

    if (!data.customer_name?.trim() || !data.email?.trim()) {
      throw new Error("Name und E-Mail sind erforderlich");
    }

    const { error } = await supabaseAdmin.from("bookings").insert({
      user_id: userId,
      service: data.service,
      vehicle: data.vehicle,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      customer_name: data.customer_name,
      email: data.email,
      phone: data.phone,
      notes: data.notes || null,
      estimated_price: data.estimated_price ?? null,
    });

    if (error) throw new Error(error.message);
    return { success: true };
  });
