import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SearchParams {
  query?: string;
  tipo?: string;
  categoria?: string;
  restauranteId?: string;
  mercadoId?: string;
  fornecedorId?: string;
  precoMin?: number;
  precoMax?: number;
  page?: number;
  pageSize?: number;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get search parameters from query string or body
    let params: SearchParams = {};

    if (req.method === "GET") {
      // Parse query parameters
      const url = new URL(req.url);
      params = {
        query: url.searchParams.get("query") || undefined,
        tipo: url.searchParams.get("tipo") || undefined,
        categoria: url.searchParams.get("categoria") || undefined,
        restauranteId: url.searchParams.get("restauranteId") || undefined,
        mercadoId: url.searchParams.get("mercadoId") || undefined,
        fornecedorId: url.searchParams.get("fornecedorId") || undefined,
        precoMin: url.searchParams.get("precoMin")
          ? parseFloat(url.searchParams.get("precoMin")!)
          : undefined,
        precoMax: url.searchParams.get("precoMax")
          ? parseFloat(url.searchParams.get("precoMax")!)
          : undefined,
        page: url.searchParams.get("page")
          ? parseInt(url.searchParams.get("page")!)
          : 1,
        pageSize: url.searchParams.get("pageSize")
          ? parseInt(url.searchParams.get("pageSize")!)
          : 20,
      };
    } else if (req.method === "POST") {
      // Parse body parameters
      params = (await req.json()) as SearchParams;
    }

    // Set defaults
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from("produtos")
      .select(
        "*, restaurante:restaurante_id(*), mercado:mercado_id(*), fornecedor:fornecedor_id(*)",
        { count: "exact" },
      )
      .eq("ativo", true);

    // Apply filters
    if (params.query) {
      query = query.or(
        `nome.ilike.%${params.query}%,descricao.ilike.%${params.query}%`,
      );
    }

    if (params.tipo) {
      query = query.eq("tipo", params.tipo);
    }

    if (params.categoria) {
      query = query.eq("categoria", params.categoria);
    }

    if (params.restauranteId) {
      query = query.eq("restaurante_id", params.restauranteId);
    }

    if (params.mercadoId) {
      query = query.eq("mercado_id", params.mercadoId);
    }

    if (params.fornecedorId) {
      query = query.eq("fornecedor_id", params.fornecedorId);
    }

    if (params.precoMin !== undefined) {
      query = query.gte("preco", params.precoMin);
    }

    if (params.precoMax !== undefined) {
      query = query.lte("preco", params.precoMax);
    }

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Return results
    return new Response(
      JSON.stringify({
        data,
        pagination: {
          page,
          pageSize,
          totalItems: count,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
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
