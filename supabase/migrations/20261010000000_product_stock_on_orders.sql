create or replace function public.sync_product_stock_for_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    order_items jsonb;
    item jsonb;
    product_id text;
    quantity integer;
    decrement_stock boolean;
begin
    if tg_op = 'INSERT' then
        decrement_stock := lower(trim(coalesce(new.status, ''))) not in ('cancelled', 'canceled');
    elsif lower(trim(coalesce(old.status, ''))) in ('cancelled', 'canceled')
        and lower(trim(coalesce(new.status, ''))) not in ('cancelled', 'canceled') then
        decrement_stock := true;
    elsif lower(trim(coalesce(old.status, ''))) not in ('cancelled', 'canceled')
        and lower(trim(coalesce(new.status, ''))) in ('cancelled', 'canceled') then
        decrement_stock := false;
    else
        return new;
    end if;

    order_items := new.items;
    if jsonb_typeof(order_items) <> 'array' then
        raise exception 'Order items must be an array.';
    end if;

    for item in select value from jsonb_array_elements(order_items)
    loop
        product_id := coalesce(item ->> 'id', item ->> 'product_id', item ->> 'productId');
        if nullif(product_id, '') is null then
            raise exception 'An order item is missing its product ID.';
        end if;

        begin
            quantity := coalesce(nullif(item ->> 'quantity', '')::integer, 1);
        exception
            when invalid_text_representation or numeric_value_out_of_range then
                raise exception 'Order item quantity must be a positive integer.';
        end;
        if quantity <= 0 then
            raise exception 'Order item quantity must be a positive integer.';
        end if;

        if decrement_stock then
            update public.products
            set stock = stock - quantity
            where id = product_id
              and stock >= quantity;
            if not found then
                raise exception 'Insufficient stock for product %.', product_id;
            end if;
        else
            update public.products
            set stock = coalesce(stock, 0) + quantity
            where id = product_id;
        end if;
    end loop;

    return new;
end;
$$;

drop trigger if exists orders_sync_product_stock on public.orders;
create trigger orders_sync_product_stock
after insert or update of status on public.orders
for each row
execute function public.sync_product_stock_for_order();

revoke all on function public.sync_product_stock_for_order() from public, anon, authenticated;
