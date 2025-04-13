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

    // Get the job type from the request
    const { jobType } = await req.json();

    if (!jobType) {
      return new Response(JSON.stringify({ error: "Job type is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Execute the appropriate job
    if (jobType === "expire_carts") {
      // Expire inactive carts
      const { data, error } = await supabase.rpc("expire_inactive_carts");

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to expire inactive carts",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Inactive carts expired successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else if (jobType === "cancel_unpaid_orders") {
      // Cancel unpaid orders older than 24 hours
      const { data, error } = await supabase
        .from("pedidos")
        .update({ status: "cancelado" })
        .eq("status", "em_preparo")
        .lt(
          "data_pedido",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        )
        .not(
          "id",
          "in",
          supabase
            .from("pagamentos")
            .select("pedido_id")
            .eq("status", "aprovado"),
        );

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to cancel unpaid orders",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Unpaid orders cancelled successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else if (jobType === "clean_old_notifications") {
      // Delete read notifications older than 30 days
      const { data, error } = await supabase
        .from("notificacoes")
        .delete()
        .eq("lida", true)
        .lt(
          "data_envio",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        );

      if (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to clean old notifications",
            details: error,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Old notifications cleaned successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown job type: ${jobType}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
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
