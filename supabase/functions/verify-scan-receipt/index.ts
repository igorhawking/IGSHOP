import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyReceiptPayload {
  receiptData: {
    pedidoId: string;
    userId: string;
    timestamp: string;
    verificacao: string;
  };
  storeId: string;
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
    const { receiptData, storeId } = (await req.json()) as VerifyReceiptPayload;

    if (!receiptData || !storeId) {
      return new Response(
        JSON.stringify({
          error: "Dados do recibo e ID da loja são obrigatórios",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Verify if order exists
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", receiptData.pedidoId)
      .eq("user_id", receiptData.userId)
      .single();

    if (pedidoError || !pedido) {
      return new Response(
        JSON.stringify({
          error: "Pedido não encontrado ou inválido",
          valid: false,
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
      .eq("pedido_id", receiptData.pedidoId)
      .eq("status", "aprovado")
      .single();

    if (pagamentoError || !pagamento) {
      return new Response(
        JSON.stringify({
          error: "Pagamento não encontrado ou não aprovado",
          valid: false,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Verify timestamp is not too old (24 hours)
    const receiptTime = new Date(receiptData.timestamp).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - receiptTime;

    if (timeDiff > 24 * 60 * 60 * 1000) {
      // 24 hours in milliseconds
      return new Response(
        JSON.stringify({ error: "Recibo expirado", valid: false }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // In a real app, you would:
    // 1. Verify the signature/hash of the receipt
    // 2. Check if the receipt has been used before
    // 3. Mark the receipt as used

    // For this example, we'll just return success
    return new Response(
      JSON.stringify({
        valid: true,
        pedido: {
          id: pedido.id,
          itens: pedido.itens,
          valorTotal: pedido.valor_total,
          dataPedido: pedido.data_pedido,
        },
        verificadoEm: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, valid: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
