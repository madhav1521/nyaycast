-- Run once in Neon SQL Editor after the normalized schema has been created.
-- This preserves the existing site_content JSON row before removing the legacy table.

DO $$
DECLARE
  content JSONB;
BEGIN
  IF to_regclass('public.site_content') IS NULL THEN
    RETURN;
  END IF;

  SELECT value INTO content FROM public.site_content WHERE key = 'main' LIMIT 1;
  IF content IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.site_settings (
    firm_name, city, hero_title, hero_accent, hero_description,
    about_title, about_description, about_image, why_image, address,
    phone, email, notification_email, office_hours, linkedin_url,
    facebook_url, instagram_url, whatsapp_url, nyaycast_description, disclaimer
  ) VALUES (
    COALESCE(content->>'firmName', 'Manas A. Agravat & Associates'),
    COALESCE(content->>'city', 'Ahmedabad'),
    COALESCE(content->>'heroTitle', 'Good counsel'),
    COALESCE(content->>'heroAccent', 'changes everything.'),
    COALESCE(content->>'heroDescription', 'Honest, skilled, and dedicated representation for the legal moments that matter most.'),
    COALESCE(content->>'aboutTitle', 'Personal attention. Purposeful action.'),
    COALESCE(content->>'aboutDescription', ''),
    content->>'aboutImage',
    content->>'whyImage',
    COALESCE(content->>'address', ''),
    COALESCE(content->>'phone', ''),
    COALESCE(content->>'email', ''),
    COALESCE(content->>'notificationEmail', 'manas0812@yopmail.com'),
    COALESCE(content->>'officeHours', ''),
    content->'socials'->>'linkedin',
    content->'socials'->>'facebook',
    content->'socials'->>'instagram',
    content->'socials'->>'whatsapp',
    COALESCE(content->>'nyaycastDescription', ''),
    COALESCE(content->>'disclaimer', '')
  ) ON CONFLICT (id) DO UPDATE SET
    firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, hero_title = EXCLUDED.hero_title,
    hero_accent = EXCLUDED.hero_accent, hero_description = EXCLUDED.hero_description,
    about_title = EXCLUDED.about_title, about_description = EXCLUDED.about_description,
    about_image = EXCLUDED.about_image, why_image = EXCLUDED.why_image, address = EXCLUDED.address,
    phone = EXCLUDED.phone, email = EXCLUDED.email, notification_email = EXCLUDED.notification_email,
    office_hours = EXCLUDED.office_hours, linkedin_url = EXCLUDED.linkedin_url, facebook_url = EXCLUDED.facebook_url,
    instagram_url = EXCLUDED.instagram_url, whatsapp_url = EXCLUDED.whatsapp_url,
    nyaycast_description = EXCLUDED.nyaycast_description, disclaimer = EXCLUDED.disclaimer, updated_at = NOW();

  DELETE FROM public.site_services;
  INSERT INTO public.site_services (title, description, image, sort_order)
  SELECT item->>'title', item->>'description', item->>'image', ordinality - 1
  FROM jsonb_array_elements(content->'services') WITH ORDINALITY AS items(item, ordinality);

  DELETE FROM public.site_strengths;
  INSERT INTO public.site_strengths (label, sort_order)
  SELECT value, ordinality - 1
  FROM jsonb_array_elements_text(content->'strengths') WITH ORDINALITY AS items(value, ordinality);

  DELETE FROM public.site_team_members;
  INSERT INTO public.site_team_members (name, role, initials, image, sort_order)
  SELECT item->>'name', item->>'role', item->>'initials', item->>'image', ordinality - 1
  FROM jsonb_array_elements(content->'team') WITH ORDINALITY AS items(item, ordinality);

  DELETE FROM public.site_testimonials;
  INSERT INTO public.site_testimonials (name, quote, sort_order)
  SELECT item->>'name', item->>'quote', ordinality - 1
  FROM jsonb_array_elements(content->'testimonials') WITH ORDINALITY AS items(item, ordinality);

  DELETE FROM public.site_articles;
  INSERT INTO public.site_articles (category, title, href, image, sort_order)
  SELECT item->>'category', item->>'title', COALESCE(item->>'href', ''), item->>'image', ordinality - 1
  FROM jsonb_array_elements(content->'articles') WITH ORDINALITY AS items(item, ordinality);

  DROP TABLE public.site_content;
END $$;