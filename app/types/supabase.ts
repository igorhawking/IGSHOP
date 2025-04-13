export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_hora: string
          id: string
          pedido_id: string | null
          servico_id: string
          status: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_hora: string
          id?: string
          pedido_id?: string | null
          servico_id: string
          status?: string
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_hora?: string
          id?: string
          pedido_id?: string | null
          servico_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_pedido_id_fkey"
            columns: ["pedido_id"]
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      avaliacoes: {
        Row: {
          comentario: string | null
          criado_em: string | null
          fornecedor_id: string | null
          id: string
          mercado_id: string | null
          nota: number
          pedido_id: string
          restaurante_id: string | null
          user_id: string
        }
        Insert: {
          comentario?: string | null
          criado_em?: string | null
          fornecedor_id?: string | null
          id?: string
          mercado_id?: string | null
          nota: number
          pedido_id: string
          restaurante_id?: string | null
          user_id: string
        }
        Update: {
          comentario?: string | null
          criado_em?: string | null
          fornecedor_id?: string | null
          id?: string
          mercado_id?: string | null
          nota?: number
          pedido_id?: string
          restaurante_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            referencedRelation: "fornecedores_servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_mercado_id_fkey"
            columns: ["mercado_id"]
            referencedRelation: "mercados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_pedido_id_fkey"
            columns: ["pedido_id"]
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_restaurante_id_fkey"
            columns: ["restaurante_id"]
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      carrinhos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          desconto: number | null
          expira_em: string | null
          forma_pagamento: string | null
          id: string
          itens: Json
          status: Database["public"]["Enums"]["carrinho_status"]
          total: number
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          desconto?: number | null
          expira_em?: string | null
          forma_pagamento?: string | null
          id?: string
          itens?: Json
          status?: Database["public"]["Enums"]["carrinho_status"]
          total?: number
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          desconto?: number | null
          expira_em?: string | null
          forma_pagamento?: string | null
          id?: string
          itens?: Json
          status?: Database["public"]["Enums"]["carrinho_status"]
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrinhos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      enderecos: {
        Row: {
          apelido: string
          atualizado_em: string | null
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          criado_em: string | null
          estado: string
          geo_location: unknown | null
          id: string
          numero: string
          rua: string
          user_id: string
        }
        Insert: {
          apelido: string
          atualizado_em?: string | null
          bairro: string
          cep: string
          cidade: string
          complemento?: string | null
          criado_em?: string | null
          estado: string
          geo_location?: unknown | null
          id?: string
          numero: string
          rua: string
          user_id: string
        }
        Update: {
          apelido?: string
          atualizado_em?: string | null
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          criado_em?: string | null
          estado?: string
          geo_location?: unknown | null
          id?: string
          numero?: string
          rua?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enderecos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      fornecedores_servicos: {
        Row: {
          atualizado_em: string | null
          banner_url: string | null
          categoria: string
          cnpj: string | null
          criado_em: string | null
          id: string
          logo_url: string | null
          nome: string
          status: Database["public"]["Enums"]["loja_status"]
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          banner_url?: string | null
          categoria: string
          cnpj?: string | null
          criado_em?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          status?: Database["public"]["Enums"]["loja_status"]
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          banner_url?: string | null
          categoria?: string
          cnpj?: string | null
          criado_em?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          status?: Database["public"]["Enums"]["loja_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_servicos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mercados: {
        Row: {
          atualizado_em: string | null
          banner_url: string | null
          cnpj: string | null
          criado_em: string | null
          geo_location: unknown | null
          id: string
          logo_url: string | null
          nome: string
          status: Database["public"]["Enums"]["loja_status"]
          taxa_entrega: number | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          banner_url?: string | null
          cnpj?: string | null
          criado_em?: string | null
          geo_location?: unknown | null
          id?: string
          logo_url?: string | null
          nome: string
          status?: Database["public"]["Enums"]["loja_status"]
          taxa_entrega?: number | null
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          banner_url?: string | null
          cnpj?: string | null
          criado_em?: string | null
          geo_location?: unknown | null
          id?: string
          logo_url?: string | null
          nome?: string
          status?: Database["public"]["Enums"]["loja_status"]
          taxa_entrega?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercados_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notificacoes: {
        Row: {
          data_envio: string | null
          id: string
          lida: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          data_envio?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          data_envio?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pagamentos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          gateway_data: Json | null
          gateway_id: string | null
          id: string
          pedido_id: string
          status: Database["public"]["Enums"]["pagamento_status"]
          tipo: Database["public"]["Enums"]["pagamento_tipo"]
          valor_total: number
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          gateway_data?: Json | null
          gateway_id?: string | null
          id?: string
          pedido_id: string
          status?: Database["public"]["Enums"]["pagamento_status"]
          tipo: Database["public"]["Enums"]["pagamento_tipo"]
          valor_total: number
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          gateway_data?: Json | null
          gateway_id?: string | null
          id?: string
          pedido_id?: string
          status?: Database["public"]["Enums"]["pagamento_status"]
          tipo?: Database["public"]["Enums"]["pagamento_tipo"]
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pedido_id_fkey"
