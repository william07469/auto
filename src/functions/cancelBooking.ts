import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/auth-middleware";
import { supabaseAdmin } from "@/integrations/client.server";

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { bookingId: string }) => input)
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { bookingId } = data;

    // Sahiplik kontrolü: email eşleşmesi değil, user_id eşleşmesi kullan.
    // Email tabanlı kontrol; email'in değiştirilmesi veya iki hesabın aynı
    // email paylaşması durumunda bypass edilebilir.
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("id, user_id, status")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) throw new Error("Buchung nicht gefunden");

    // Kesin sahiplik kontrolü — UUID karşılaştırması
    if (booking.user_id !== userId) throw new Error("Nicht autorisiert");

    if (booking.status !== "neu") throw new Error("Nur ausstehende Buchungen können storniert werden");

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "storniert" })
      .eq("id", bookingId)
      .eq("user_id", userId); // çift güvence: WHERE koşuluna user_id de eklendi

    if (error) throw new Error(error.message);
    return { success: true };
  });
