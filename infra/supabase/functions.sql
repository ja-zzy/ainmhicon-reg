create or replace function get_next_badge_id(p_convention_id uuid)
returns integer
language plpgsql
as $$
declare
  next_id integer;
begin
  update badge_counters
  set badge_counter = badge_counter + 1
  where convention_id = p_convention_id
  returning badge_counter into next_id;

  -- If no row was updated, insert one and return 1
  if not found then
    insert into badge_counters (convention_id, badge_counter)
    values (p_convention_id, 1)
    returning badge_counter into next_id;
  end if;

  return next_id;
end;
$$;

create or replace function set_badge_id()
returns trigger
language plpgsql
as $$
begin
  if new.badge_id is null then
    new.badge_id := get_next_badge_id(new.convention_id);
  end if;
  return new;
end;
$$;
