-- Eliminar tabla existente si ya existe (para empezar limpio)
DROP TABLE IF EXISTS site_content CASCADE;

-- Eliminar función si existe
DROP FUNCTION IF EXISTS update_site_content_updated_at() CASCADE;

-- Crear tabla site_content para almacenar configuración del sitio
CREATE TABLE site_content (
  id INTEGER PRIMARY KEY,
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_background_image TEXT,
  
  -- History Section
  history_label TEXT,
  history_title TEXT,
  history_description TEXT,
  history_image TEXT,
  
  -- Philosophy Section
  philosophy_label TEXT,
  philosophy_title TEXT,
  philosophy_description TEXT,
  philosophy_image TEXT,
  philosophy_badge_1 TEXT,
  philosophy_badge_2 TEXT,
  
  -- Footer & Contact
  footer_description TEXT,
  contact_address TEXT,
  contact_phone TEXT,
  
  -- Schedule/Horario
  schedule_weekday TEXT DEFAULT 'Mar - Jue',
  schedule_weekday_hours TEXT DEFAULT '12:30 - 23:00',
  schedule_weekend TEXT DEFAULT 'Vie - Sáb',
  schedule_weekend_hours TEXT DEFAULT '12:30 - 00:00',
  schedule_closed_day TEXT DEFAULT 'Lunes',
  
  -- CTA Section
  cta_background_image TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint to ensure only one settings record
  CONSTRAINT site_content_singleton CHECK (id = 1)
);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_content_updated_at_trigger
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_updated_at();

-- Insertar registro inicial con valores por defecto
INSERT INTO site_content (id, hero_title, hero_subtitle, hero_description, contact_phone)
VALUES (
  1,
  'Sabores Auténticos,',
  'Experiencia Inolvidable.',
  'Descubre la exquisita fusión de sabores peruanos en el corazón de la ciudad.',
  '+51 XXX XXX XXX'
);

-- Comentarios de documentación
COMMENT ON TABLE site_content IS 'Tabla singleton para almacenar la configuración general del sitio web';
COMMENT ON COLUMN site_content.id IS 'ID único (siempre 1) para garantizar un solo registro';
COMMENT ON CONSTRAINT site_content_singleton ON site_content IS 'Garantiza que solo puede existir un registro con id=1';
