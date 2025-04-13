import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QRCodePayload {
  pedidoId: string;
  userId: string;
}

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

    // Get request data
    const { pedidoId, userId } = (await req.json()) as QRCodePayload;

    if (!pedidoId || !userId) {
      return new Response(
        JSON.stringify({ error: "Pedido ID e User ID são obrigatórios" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Verify if order exists and belongs to the user
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", pedidoId)
      .eq("user_id", userId)
      .single();

    if (pedidoError || !pedido) {
      return new Response(
        JSON.stringify({
          error: "Pedido não encontrado ou não pertence ao usuário",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Check if payment is approved
    const { data: pagamento, error: pagamentoError } = await supabase
      .from("pagamentos")
      .select("*")
      .eq("pedido_id", pedidoId)
      .eq("status", "aprovado")
      .single();

    if (pagamentoError || !pagamento) {
      return new Response(
        JSON.stringify({ error: "Pagamento não encontrado ou não aprovado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Generate receipt data
    const receiptData = {
      pedidoId: pedido.id,
      userId: pedido.user_id,
      itens: pedido.itens,
      valorTotal: pedido.valor_total,
      dataPedido: pedido.data_pedido,
      pagamentoId: pagamento.id,
      timestamp: new Date().toISOString(),
      verificacao: btoa(
        `${pedido.id}-${pedido.user_id}-${new Date().toISOString()}`,
      ),
    };

    // In a real app, you would:
    // 1. Generate a secure, signed receipt
    // 2. Store the receipt in the database
    // 3. Generate a QR code that can be verified by the store

    // For this example, we'll just return a mock QR code URL
    return new Response(
      JSON.stringify({
        success: true,
        receiptData,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(receiptData))}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
