-- Function to update timestamp on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at_column trigger to all tables with atualizado_em
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at
    BEFORE UPDATE ON enderecos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurantes_updated_at
    BEFORE UPDATE ON restaurantes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mercados_updated_at
    BEFORE UPDATE ON mercados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fornecedores_servicos_updated_at
    BEFORE UPDATE ON fornecedores_servicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carrinhos_updated_at
    BEFORE UPDATE ON carrinhos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at
    BEFORE UPDATE ON servicos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promocoes_updated_at
    BEFORE UPDATE ON promocoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after auth.user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, nome, email)
  VALUES (NEW.id, 'cliente', COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile after auth.user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create notification after order is created
CREATE OR REPLACE FUNCTION public.after_pedido_insert()
RETURNS TRIGGER AS $$
DECLARE
  loja_user_id UUID;
  loja_nome TEXT;
BEGIN
  -- Create notification for customer
  INSERT INTO notificacoes (user_id, tipo, titulo, mensagem)
  VALUES (NEW.user_id, 'pedido_criado', 'Pedido Recebido', 'Seu pedido #' || substring(NEW.id::text, 1, 8) || ' foi recebido e está sendo processado.');
  
  -- Find store owner and create notification for them
  IF NEW.restaurante_id IS NOT NULL THEN
    SELECT user_id, nome INTO loja_user_id, loja_nome FROM restaurantes WHERE id = NEW.restaurante_id;
  ELSIF NEW.mercado_id IS NOT NULL THEN
    SELECT user_id, nome INTO loja_user_id, loja_nome FROM mercados WHERE id = NEW.mercado_id;
  ELSIF NEW.fornecedor_id IS NOT NULL THEN
    SELECT user_id, nome INTO loja_user_id, loja_nome FROM fornecedores_servicos WHERE id = NEW.fornecedor_id;
  END IF;
  
  IF loja_user_id IS NOT NULL THEN
    INSERT INTO notificacoes (user_id, tipo, titulo, mensagem)
    VALUES (loja_user_id, 'novo_pedido', 'Novo Pedido', 'Você recebeu um novo pedido #' || substring(NEW.id::text, 1, 8));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification after order is created
CREATE TRIGGER on_pedido_created
  AFTER INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION public.after_pedido_insert();

-- Function to create notification after order status is updated
CREATE OR REPLACE FUNCTION public.after_pedido_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    -- Create notification for customer about status change
    INSERT INTO notificacoes (user_id, tipo, titulo, mensagem)
    VALUES (
      NEW.user_id, 
      'status_pedido', 
      'Status do Pedido Atualizado', 
      'Seu pedido #' || substring(NEW.id::text, 1, 8) || ' está ' || 
      CASE 
        WHEN NEW.status = 'em_preparo' THEN 'em preparo'
        WHEN NEW.status = 'saiu_para_entrega' THEN 'a caminho'
        WHEN NEW.status = 'entregue' THEN 'entregue'
        WHEN NEW.status = 'cancelado' THEN 'cancelado'
        ELSE NEW.status
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification after order status is updated
CREATE TRIGGER on_pedido_updated
  AFTER UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION public.after_pedido_update();

-- Function to update cart total when items are added/removed
CREATE OR REPLACE FUNCTION public.update_cart_total()
RETURNS TRIGGER AS $$
DECLARE
  total_value DECIMAL(10, 2) := 0;
  item JSONB;
  product_price DECIMAL(10, 2);
  product_id UUID;
  quantity INTEGER;
BEGIN
  -- Calculate total from items array
  IF NEW.itens IS NOT NULL AND jsonb_array_length(NEW.itens) > 0 THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.itens)
    LOOP
      product_id := (item->>'produto_id')::UUID;
      quantity := COALESCE((item->>'quantidade')::INTEGER, 1);
      
      SELECT preco INTO product_price FROM produtos WHERE id = product_id;
      
      IF product_price IS NOT NULL THEN
        total_value := total_value + (product_price * quantity);
      END IF;
    END LOOP;
  END IF;
  
  -- Update the cart total
  NEW.total := total_value;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update cart total when items are added/removed
CREATE TRIGGER before_cart_update
  BEFORE INSERT OR UPDATE ON carrinhos
  FOR EACH ROW EXECUTE FUNCTION public.update_cart_total();

-- Function to handle scan item insertion
CREATE OR REPLACE FUNCTION public.on_scan_item_insert()
RETURNS TRIGGER AS $$
DECLARE
  active_cart_id UUID;
  cart_items JSONB;
  product_exists BOOLEAN := FALSE;
  updated_items JSONB := '[]'::JSONB;
  i INTEGER;
  current_item JSONB;
BEGIN
  -- Find active cart or create one
  SELECT id, itens INTO active_cart_id, cart_items
  FROM carrinhos
  WHERE user_id = NEW.user_id AND status = 'aberto'
  ORDER BY criado_em DESC
  LIMIT 1;
  
  IF active_cart_id IS NULL THEN
    -- Create new cart
    INSERT INTO carrinhos (user_id, itens)
    VALUES (NEW.user_id, '[{"produto_id":"' || NEW.produto_id || '", "quantidade":' || NEW.quantidade || '}]')
    RETURNING id INTO active_cart_id;
  ELSE
    -- Update existing cart
    -- Check if product already exists in cart
    IF jsonb_array_length(cart_items) > 0 THEN
      FOR i IN 0..jsonb_array_length(cart_items)-1 LOOP
        current_item := cart_items->i;
        IF current_item->>'produto_id' = NEW.produto_id::TEXT THEN
          -- Update quantity of existing item
          current_item := jsonb_set(
            current_item, 
            '{quantidade}', 
            to_jsonb((current_item->>'quantidade')::INTEGER + NEW.quantidade)
          );
          product_exists := TRUE;
        END IF;
        updated_items := updated_items || current_item;
      END LOOP;
    END IF;
    
    -- If product doesn't exist in cart, add it
    IF NOT product_exists THEN
      updated_items := updated_items || jsonb_build_object('produto_id', NEW.produto_id, 'quantidade', NEW.quantidade);
    END IF;
    
    -- Update cart with new items
    UPDATE carrinhos
    SET itens = updated_items
    WHERE id = active_cart_id;
  END IF;
  
  -- Link scan item to cart
  NEW.carrinho_id := active_cart_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle scan item insertion
CREATE TRIGGER on_scan_item_inserted
  BEFORE INSERT ON scan_items
  FOR EACH ROW EXECUTE FUNCTION public.on_scan_item_insert();

-- Function to expire carts after 24 hours
CREATE OR REPLACE FUNCTION public.expire_inactive_carts()
RETURNS void AS $$
BEGIN
  UPDATE carrinhos
  SET status = 'cancelado'
  WHERE status = 'aberto' AND expira_em < now();
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
