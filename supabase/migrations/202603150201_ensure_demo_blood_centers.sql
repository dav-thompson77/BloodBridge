create or replace function public.ensure_demo_blood_centers()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.blood_centers limit 1) then
    return;
  end if;

  insert into public.blood_centers (id, name, parish, address, phone, is_active)
  values
    (1, 'National Blood Transfusion Service', 'Kingston', '21 Slipe Pen Road, Kingston', '+1-876-555-3001', true),
    (2, 'National Chest Hospital / Kiwanis Blood Collection Centre', 'Kingston', '36 Barbican Road, Kingston 6', '+1-876-555-3005', true),
    (3, 'St. Ann''s Bay Hospital', 'St. Ann', '15 St. Ann''s Bay Main Road, St. Ann''s Bay', '+1-876-555-3002', true),
    (4, 'Savanna-la-Mar Hospital', 'Westmoreland', '6 Beckford Street, Savanna-la-Mar', '+1-876-555-3003', true),
    (5, 'Port Antonio Hospital', 'Portland', 'West Street, Port Antonio', '+1-876-555-3004', true)
  on conflict (id) do update
  set
    name = excluded.name,
    parish = excluded.parish,
    address = excluded.address,
    phone = excluded.phone,
    is_active = excluded.is_active;
end;
$$;

grant execute on function public.ensure_demo_blood_centers() to anon, authenticated;
