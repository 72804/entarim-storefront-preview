-- Entarim CMS schema
-- Run this in the Supabase SQL editor (once per project).
-- Service role bypasses RLS; public clients can only read published data.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  slug text unique not null,
  name text not null,
  category_id uuid references public.categories (id) on delete set null,
  price numeric(12, 2) not null default 0,
  old_price numeric(12, 2),
  description text[] not null default '{}',
  sizes text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  show_on_homepage boolean not null default false,
  homepage_sort int not null default 0,
  archived boolean not null default false,
  related_slugs text[] not null default '{}',
  generated_palette text[] not null default '{}',
  palette_override text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  slug text not null,
  name text not null,
  hex text not null default '#888888',
  sort_order int not null default 0,
  active boolean not null default true,
  listing_image_id uuid,
  swatch_image_url text,
  swatch_source_image_id uuid,
  swatch_x numeric(6, 2),
  swatch_y numeric(6, 2),
  swatch_zoom numeric(6, 2),
  unique (product_id, slug)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_placements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  placement_key text not null,
  sort_order int not null default 0,
  unique (product_id, placement_key)
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_published_idx on public.products (published, archived);
create index if not exists product_variants_product_idx on public.product_variants (product_id, sort_order);
create index if not exists product_images_variant_idx on public.product_images (variant_id, sort_order);
create index if not exists product_placements_key_idx on public.product_placements (placement_key, sort_order);

alter table public.product_variants
  drop constraint if exists product_variants_listing_image_id_fkey;
alter table public.product_variants
  add constraint product_variants_listing_image_id_fkey
  foreign key (listing_image_id) references public.product_images (id) on delete set null;
alter table public.product_variants
  drop constraint if exists product_variants_swatch_source_image_id_fkey;
alter table public.product_variants
  add constraint product_variants_swatch_source_image_id_fkey
  foreign key (swatch_source_image_id) references public.product_images (id) on delete set null;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_placements enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (active = true);

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (published = true and archived = false);

drop policy if exists variants_public_read on public.product_variants;
create policy variants_public_read on public.product_variants
  for select using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.published = true and p.archived = false
    )
  );

drop policy if exists images_public_read on public.product_images;
create policy images_public_read on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.published = true and p.archived = false
    )
  );

drop policy if exists placements_public_read on public.product_placements;
create policy placements_public_read on public.product_placements
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.published = true and p.archived = false
    )
  );

insert into storage.buckets (id, name, public)
values ('product-assets', 'product-assets', true)
on conflict (id) do nothing;

drop policy if exists product_assets_public_read on storage.objects;
create policy product_assets_public_read on storage.objects
  for select using (bucket_id = 'product-assets');
