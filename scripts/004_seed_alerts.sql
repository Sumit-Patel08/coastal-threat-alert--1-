insert into public.alerts (title, message, severity, audience, status, created_by)
values
  ('High tide advisory', 'Expect unusually high tides this evening. Avoid low-lying roads near the coast.', 'info', 'all', 'sent', null),
  ('Coastal flood watch', 'Minor flooding possible during tomorrow''s morning high tide.', 'watch', 'resident', 'sent', null),
  ('Erosion hotspot update', 'Shoreline retreat observed near Pier Point. Field validation requested.', 'warning', 'agency', 'draft', null),
  ('Storm surge risk', 'Potential 1-2 ft surge with incoming system this weekend. Prepare sandbags.', 'severe', 'community', 'draft', null);
