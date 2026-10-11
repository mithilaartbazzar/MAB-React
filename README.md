# Mithila-Chitrakala-Store--React

## Product inventory

Run [`supabase/migrations/20261010000000_product_stock_on_orders.sql`](./supabase/migrations/20261010000000_product_stock_on_orders.sql) in the Supabase SQL Editor to install the order inventory trigger. New orders atomically reduce product stock, insufficient-stock orders are rejected, and cancelling an order restores its stock. After installing the migration, successful checkouts refresh the storefront's product data.