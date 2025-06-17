-- Test script to verify orders and order_items tables are working correctly

-- Check current orders
SELECT 
  o.id,
  o.user_id,
  o.cook_id,
  o.status,
  o.total,
  o.payment_status,
  o.created_at
FROM orders o
ORDER BY o.created_at DESC
LIMIT 5;

-- Check order items (if table exists)
SELECT 
  oi.id,
  oi.order_id,
  oi.menu_item_id,
  oi.cook_id,
  oi.quantity,
  oi.price,
  oi.item_name,
  oi.total_price,
  oi.created_at
FROM order_items oi
ORDER BY oi.created_at DESC
LIMIT 10;

-- Check for any orders without order items (potential issues)
SELECT 
  o.id as order_id,
  o.total,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.total
HAVING COUNT(oi.id) = 0
ORDER BY o.created_at DESC;

-- Verify cook data
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.is_available,
  COUNT(m.id) as menu_items_count
FROM cooks c
LEFT JOIN dabba_menu m ON c.id = m.cook_id
GROUP BY c.id, c.first_name, c.last_name, c.email, c.is_available
ORDER BY menu_items_count DESC;
