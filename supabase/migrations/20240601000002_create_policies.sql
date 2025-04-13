-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enderecos policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON enderecos;
CREATE POLICY "Users can view their own addresses"
  ON enderecos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON enderecos;
CREATE POLICY "Users can insert their own addresses"
  ON enderecos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON enderecos;
CREATE POLICY "Users can update their own addresses"
  ON enderecos FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON enderecos;
CREATE POLICY "Users can delete their own addresses"
  ON enderecos FOR DELETE
  USING (auth.uid() = user_id);

-- Restaurantes policies
DROP POLICY IF EXISTS "Public can view restaurants" ON restaurantes;
CREATE POLICY "Public can view restaurants"
  ON restaurantes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage their restaurants" ON restaurantes;
CREATE POLICY "Owners can manage their restaurants"
  ON restaurantes FOR ALL
  USING (auth.uid() = user_id);

-- Mercados policies
DROP POLICY IF EXISTS "Public can view markets" ON mercados;
CREATE POLICY "Public can view markets"
  ON mercados FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage their markets" ON mercados;
CREATE POLICY "Owners can manage their markets"
  ON mercados FOR ALL
  USING (auth.uid() = user_id);

-- Fornecedores_servicos policies
DROP POLICY IF EXISTS "Public can view service providers" ON fornecedores_servicos;
CREATE POLICY "Public can view service providers"
  ON fornecedores_servicos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage their service providers" ON fornecedores_servicos;
CREATE POLICY "Owners can manage their service providers"
  ON fornecedores_servicos FOR ALL
  USING (auth.uid() = user_id);

-- Produtos policies
DROP POLICY IF EXISTS "Public can view products" ON produtos;
CREATE POLICY "Public can view products"
  ON produtos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Restaurant owners can manage their products" ON produtos;
CREATE POLICY "Restaurant owners can manage their products"
  ON produtos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurantes
      WHERE restaurantes.id = produtos.restaurante_id
      AND restaurantes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM mercados
      WHERE mercados.id = produtos.mercado_id
      AND mercados.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM fornecedores_servicos
      WHERE fornecedores_servicos.id = produtos.fornecedor_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

-- Carrinhos policies
DROP POLICY IF EXISTS "Users can view their own carts" ON carrinhos;
CREATE POLICY "Users can view their own carts"
  ON carrinhos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own carts" ON carrinhos;
CREATE POLICY "Users can manage their own carts"
  ON carrinhos FOR ALL
  USING (auth.uid() = user_id);

-- Pedidos policies
DROP POLICY IF EXISTS "Users can view their own orders" ON pedidos;
CREATE POLICY "Users can view their own orders"
  ON pedidos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON pedidos;
CREATE POLICY "Users can insert their own orders"
  ON pedidos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Restaurant owners can view orders for their restaurant" ON pedidos;
CREATE POLICY "Restaurant owners can view orders for their restaurant"
  ON pedidos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurantes
      WHERE restaurantes.id = pedidos.restaurante_id
      AND restaurantes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM mercados
      WHERE mercados.id = pedidos.mercado_id
      AND mercados.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM fornecedores_servicos
      WHERE fornecedores_servicos.id = pedidos.fornecedor_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Restaurant owners can update orders for their restaurant" ON pedidos;
CREATE POLICY "Restaurant owners can update orders for their restaurant"
  ON pedidos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurantes
      WHERE restaurantes.id = pedidos.restaurante_id
      AND restaurantes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM mercados
      WHERE mercados.id = pedidos.mercado_id
      AND mercados.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM fornecedores_servicos
      WHERE fornecedores_servicos.id = pedidos.fornecedor_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

-- Scan_items policies
DROP POLICY IF EXISTS "Users can view their own scanned items" ON scan_items;
CREATE POLICY "Users can view their own scanned items"
  ON scan_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own scanned items" ON scan_items;
CREATE POLICY "Users can manage their own scanned items"
  ON scan_items FOR ALL
  USING (auth.uid() = user_id);

-- Pagamentos policies
DROP POLICY IF EXISTS "Users can view their own payments" ON pagamentos;
CREATE POLICY "Users can view their own payments"
  ON pagamentos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = pagamentos.pedido_id
      AND pedidos.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Restaurant owners can view payments for their orders" ON pagamentos;
CREATE POLICY "Restaurant owners can view payments for their orders"
  ON pagamentos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pedidos
      JOIN restaurantes ON pedidos.restaurante_id = restaurantes.id
      WHERE pedidos.id = pagamentos.pedido_id
      AND restaurantes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM pedidos
      JOIN mercados ON pedidos.mercado_id = mercados.id
      WHERE pedidos.id = pagamentos.pedido_id
      AND mercados.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM pedidos
      JOIN fornecedores_servicos ON pedidos.fornecedor_id = fornecedores_servicos.id
      WHERE pedidos.id = pagamentos.pedido_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

-- Notificacoes policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notificacoes;
CREATE POLICY "Users can view their own notifications"
  ON notificacoes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notificacoes;
CREATE POLICY "Users can update their own notifications"
  ON notificacoes FOR UPDATE
  USING (auth.uid() = user_id);

-- Servicos policies
DROP POLICY IF EXISTS "Public can view services" ON servicos;
CREATE POLICY "Public can view services"
  ON servicos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service providers can manage their services" ON servicos;
CREATE POLICY "Service providers can manage their services"
  ON servicos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM fornecedores_servicos
      WHERE fornecedores_servicos.id = servicos.fornecedor_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

-- Agendamentos policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON agendamentos;
CREATE POLICY "Users can view their own appointments"
  ON agendamentos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own appointments" ON agendamentos;
CREATE POLICY "Users can insert their own appointments"
  ON agendamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service providers can view appointments for their services" ON agendamentos;
CREATE POLICY "Service providers can view appointments for their services"
  ON agendamentos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM servicos
      JOIN fornecedores_servicos ON servicos.fornecedor_id = fornecedores_servicos.id
      WHERE servicos.id = agendamentos.servico_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service providers can update appointments for their services" ON agendamentos;
CREATE POLICY "Service providers can update appointments for their services"
  ON agendamentos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM servicos
      JOIN fornecedores_servicos ON servicos.fornecedor_id = fornecedores_servicos.id
      WHERE servicos.id = agendamentos.servico_id
      AND fornecedores_servicos.user_id = auth.uid()
    )
  );

-- Promocoes policies
DROP POLICY IF EXISTS "Public can view promotions" ON promocoes;
CREATE POLICY "Public can view promotions"
  ON promocoes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Business owners can manage their promotions" ON promocoes;
CREATE POLICY "Business owners can manage their promotions"
  ON promocoes FOR ALL
  USING (
    (restaurante_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM restaurantes
      WHERE restaurantes.id = promocoes.restaurante_id
      AND restaurantes.user_id = auth.uid()
    ))
    OR
    (mercado_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM mercados
      WHERE mercados.id = promocoes.mercado_id
      AND mercados.user_id = auth.uid()
    ))
    OR
    (fornecedor_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM fornecedores_servicos
      WHERE fornecedores_servicos.id = promocoes.fornecedor_id
      AND fornecedores_servicos.user_id = auth.uid()
    ))
  );

-- Avaliacoes policies
DROP POLICY IF EXISTS "Public can view ratings" ON avaliacoes;
CREATE POLICY "Public can view ratings"
  ON avaliacoes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own ratings" ON avaliacoes;
CREATE POLICY "Users can manage their own ratings"
  ON avaliacoes FOR ALL
  USING (auth.uid() = user_id);
