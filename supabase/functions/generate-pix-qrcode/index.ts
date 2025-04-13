import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PixPayload {
  pedidoId: string;
  valor: number;
  descricao: string;
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
    const { pedidoId, valor, descricao } = (await req.json()) as PixPayload;

    if (!pedidoId || !valor) {
      return new Response(
        JSON.stringify({ error: "Pedido ID e valor são obrigatórios" }),
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
      .eq("id", pedidoId)
      .single();

    if (pedidoError || !pedido) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Generate a simple PIX payload (in a real app, you would integrate with a payment provider)
    const merchantName = "TudoGo SuperApp";
    const merchantCity = "São Paulo";
    const txid = pedidoId.replace(/-/g, "").substring(0, 25);

    // Format amount with 2 decimal places
    const formattedAmount = valor.toFixed(2);

    // Create PIX payload according to BR standards
    // This is a simplified version - in production you would use a proper library
    const payload = {
      pixKey: "tudogo@example.com", // This would be your actual PIX key
      description: descricao || `Pedido #${pedidoId.substring(0, 8)}`,
      merchantName,
      merchantCity,
      txid,
      amount: formattedAmount,
    };

    // In a real implementation, you would:
    // 1. Generate the actual PIX code using a proper library
    // 2. Generate a QR code image
    // 3. Store payment information

    // For this example, we'll create a mock payment record
    const { data: pagamento, error: pagamentoError } = await supabase
      .from("pagamentos")
      .insert({
        pedido_id: pedidoId,
        tipo: "pix",
        valor_total: valor,
        status: "pendente",
        gateway_id: txid,
        gateway_data: payload,
      })
      .select()
      .single();

    if (pagamentoError) {
      return new Response(
        JSON.stringify({
          error: "Erro ao criar registro de pagamento",
          details: pagamentoError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Return the PIX payload and a mock QR code URL
    // In a real app, you would generate an actual QR code
    return new Response(
      JSON.stringify({
        pagamentoId: pagamento.id,
        pixPayload: payload,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(payload))}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
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
