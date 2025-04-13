import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get webhook secret from environment variables
    const webhookSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET");

    // Verify webhook signature (simplified - in production use proper signature verification)
    const signature = req.headers.get("x-webhook-signature") || "";

    // In a real implementation, you would verify the signature here
    // if (!verifySignature(signature, webhookSecret, await req.text())) {
    //   return new Response(
    //     JSON.stringify({ error: "Invalid signature" }),
    //     { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    //   );
    // }

    // Parse webhook payload
    const payload = await req.json();
    const { event, data } = payload;

    // Process different webhook events
    if (event === "payment.approved") {
      // Update payment status in database
      const { data: payment, error: paymentError } = await supabase
        .from("pagamentos")
        .update({ status: "aprovado", gateway_data: data })
        .eq("gateway_id", data.id)
        .select()
        .single();

      if (paymentError) {
        return new Response(
          JSON.stringify({
            error: "Error updating payment",
            details: paymentError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      // Get order information
      const { data: order, error: orderError } = await supabase
        .from("pedidos")
        .select("*")
        .eq("id", payment.pedido_id)
        .single();

      if (orderError) {
        return new Response(
          JSON.stringify({
            error: "Error fetching order",
            details: orderError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      // Create notification for customer
      await supabase.from("notificacoes").insert({
        user_id: order.user_id,
        tipo: "pagamento_aprovado",
        titulo: "Pagamento Aprovado",
        mensagem: `Seu pagamento para o pedido #${order.id.substring(0, 8)} foi aprovado.`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment processed successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else if (event === "payment.refused") {
      // Update payment status in database
      const { data: payment, error: paymentError } = await supabase
        .from("pagamentos")
        .update({ status: "recusado", gateway_data: data })
        .eq("gateway_id", data.id)
        .select()
        .single();

      if (paymentError) {
        return new Response(
          JSON.stringify({
            error: "Error updating payment",
            details: paymentError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      // Get order information
      const { data: order, error: orderError } = await supabase
        .from("pedidos")
        .select("*")
        .eq("id", payment.pedido_id)
        .single();

      if (orderError) {
        return new Response(
          JSON.stringify({
            error: "Error fetching order",
            details: orderError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      // Create notification for customer
      await supabase.from("notificacoes").insert({
        user_id: order.user_id,
        tipo: "pagamento_recusado",
        titulo: "Pagamento Recusado",
        mensagem: `Seu pagamento para o pedido #${order.id.substring(0, 8)} foi recusado. Por favor, tente novamente.`,
      });

      return new Response(
        JSON.stringify({ success: true, message: "Payment refusal processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      // Unhandled event type
      return new Response(
        JSON.stringify({ message: `Unhandled event type: ${event}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
