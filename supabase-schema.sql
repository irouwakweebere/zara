create table if not exists public.site_content (
  id text primary key check (id = 'homepage'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select, insert, update on table public.site_content to service_role;

create table if not exists public.vendor_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  phone_number text not null default '',
  business_registration text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.vendor_stores (
  vendor_id uuid primary key references public.vendor_profiles (id) on delete cascade,
  slug text not null unique,
  store_name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  constraint vendor_store_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint vendor_store_name_length check (char_length(store_name) between 2 and 80),
  constraint vendor_store_description_length check (char_length(description) <= 500)
);

create unique index if not exists vendor_stores_slug_lower_idx
  on public.vendor_stores (lower(slug));

create table if not exists public.vendor_products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles (id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'Skincare'
    check (category in ('Skincare', 'Beauty', 'Accessories')),
  price_ngn numeric(12, 2) not null check (price_ngn > 0),
  stock_count integer not null default 0 check (stock_count >= 0),
  image_url text not null default '',
  active boolean not null default true,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_product_name_length check (char_length(name) between 2 and 120),
  constraint vendor_product_description_length check (char_length(description) <= 1000),
  constraint vendor_product_image_url check (
    image_url = '' or image_url ~ '^https://[^[:space:]]+$'
  )
);

create index if not exists vendor_products_vendor_created_idx
  on public.vendor_products (vendor_id, created_at desc);

alter table public.vendor_profiles enable row level security;
alter table public.vendor_stores enable row level security;
alter table public.vendor_products enable row level security;

revoke all on public.vendor_profiles from anon, authenticated;
revoke all on public.vendor_stores from anon, authenticated;
revoke all on public.vendor_products from anon, authenticated;

grant select on public.vendor_profiles to authenticated;
grant update (phone_number) on public.vendor_profiles to authenticated;
grant select on public.vendor_stores to anon, authenticated;
grant update (store_name, description) on public.vendor_stores to authenticated;
grant select on public.vendor_products to anon, authenticated;
grant insert (vendor_id, name, description, category, price_ngn, stock_count, image_url, active)
  on public.vendor_products to authenticated;
grant update (name, description, category, price_ngn, stock_count, image_url, active)
  on public.vendor_products to authenticated;
grant delete on public.vendor_products to authenticated;
grant all on public.vendor_profiles, public.vendor_stores, public.vendor_products to service_role;

drop policy if exists "Vendors can read their own profile" on public.vendor_profiles;
create policy "Vendors can read their own profile"
  on public.vendor_profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Approved stores are public" on public.vendor_stores;
create policy "Approved stores are public"
  on public.vendor_stores for select to anon, authenticated
  using (
    exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_stores.vendor_id and profile.status = 'approved'
    )
  );

drop policy if exists "Approved vendors can update their store" on public.vendor_stores;
create policy "Approved vendors can update their store"
  on public.vendor_stores for update to authenticated
  using (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_stores.vendor_id and profile.status = 'approved'
    )
  )
  with check (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_stores.vendor_id and profile.status = 'approved'
    )
  );

drop policy if exists "Approved products are public" on public.vendor_products;
create policy "Approved products are public"
  on public.vendor_products for select to anon, authenticated
  using (
    review_status = 'approved'
    and active
    and stock_count > 0
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_products.vendor_id and profile.status = 'approved'
    )
  );

drop policy if exists "Vendors can read their own products" on public.vendor_products;
create policy "Vendors can read their own products"
  on public.vendor_products for select to authenticated
  using (vendor_id = (select auth.uid()));

drop policy if exists "Approved vendors can add products" on public.vendor_products;
create policy "Approved vendors can add products"
  on public.vendor_products for insert to authenticated
  with check (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_products.vendor_id and profile.status = 'approved'
    )
  );

drop policy if exists "Approved vendors can update their products" on public.vendor_products;
create policy "Approved vendors can update their products"
  on public.vendor_products for update to authenticated
  using (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_products.vendor_id and profile.status = 'approved'
    )
  )
  with check (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_products.vendor_id and profile.status = 'approved'
    )
  );

drop policy if exists "Approved vendors can delete their products" on public.vendor_products;
create policy "Approved vendors can delete their products"
  on public.vendor_products for delete to authenticated
  using (
    vendor_id = (select auth.uid())
    and exists (
      select 1 from public.vendor_profiles profile
      where profile.id = vendor_products.vendor_id and profile.status = 'approved'
    )
  );

create or replace function public.create_vendor_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  application_metadata jsonb := new.raw_user_meta_data;
  application_email text := lower(trim(new.email));
  store_slug text := lower(trim(application_metadata ->> 'store_slug'));
begin
  if application_metadata ->> 'account_type' <> 'vendor' then
    return new;
  end if;

  insert into public.vendor_profiles (id, email, phone_number, business_registration)
  values (
    new.id,
    application_email,
    trim(application_metadata ->> 'phone_number'),
    trim(application_metadata ->> 'business_registration')
  );

  insert into public.vendor_stores (vendor_id, slug, store_name, description)
  values (
    new.id,
    store_slug,
    trim(application_metadata ->> 'store_name'),
    trim(application_metadata ->> 'description')
  );

  return new;
end;
$$;

drop trigger if exists on_vendor_application_created on auth.users;
create trigger on_vendor_application_created
  after insert on auth.users
  for each row execute function public.create_vendor_application();

create or replace function public.require_product_moderation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if tg_op = 'INSERT' then
      new.review_status := 'pending';
    elsif row(new.name, new.description, new.category, new.price_ngn, new.image_url)
      is distinct from row(old.name, old.description, old.category, old.price_ngn, old.image_url) then
      new.review_status := 'pending';
    else
      new.review_status := old.review_status;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists vendor_product_requires_review on public.vendor_products;
create trigger vendor_product_requires_review
  before insert or update on public.vendor_products
  for each row execute function public.require_product_moderation();