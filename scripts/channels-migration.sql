-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  youtube_id TEXT UNIQUE,
  categories TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a unique constraint to the name column in the channels table
ALTER TABLE channels ADD CONSTRAINT unique_channel_name UNIQUE (name);

-- Add channel_id column to reactions table (nullable at first for backward compatibility)
ALTER TABLE reactions ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES channels(id);

-- Create index on channel_id for faster lookups
CREATE INDEX IF NOT EXISTS reactions_channel_id_idx ON reactions(channel_id);

-- Create a migration function to populate the channels table from existing reactions
CREATE OR REPLACE FUNCTION migrate_channels() RETURNS void AS $$
DECLARE
  channel_record RECORD;
BEGIN
  -- For each unique channel_name in reactions, create a channel record
  FOR channel_record IN 
    SELECT DISTINCT channel_name FROM reactions WHERE channel_name IS NOT NULL
  LOOP
    -- Insert the channel if it doesn't exist yet
    INSERT INTO channels (name)
    VALUES (channel_record.channel_name)
    ON CONFLICT (name) DO NOTHING;
  END LOOP;
  
  -- Update reactions with the corresponding channel_id
  UPDATE reactions r
  SET channel_id = c.id
  FROM channels c
  WHERE r.channel_name = c.name AND r.channel_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration
SELECT migrate_channels();

-- Create a trigger to keep channel_id and channel_name in sync
CREATE OR REPLACE FUNCTION sync_channel_info() RETURNS TRIGGER AS $$
BEGIN
  -- When channel_id is updated, update channel_name
  IF NEW.channel_id IS NOT NULL AND (OLD.channel_id IS NULL OR OLD.channel_id != NEW.channel_id) THEN
    SELECT name INTO NEW.channel_name FROM channels WHERE id = NEW.channel_id;
  -- When channel_name is updated but channel_id is not set, find or create channel
  ELSIF NEW.channel_name IS NOT NULL AND NEW.channel_name != OLD.channel_name AND NEW.channel_id IS NULL THEN
    INSERT INTO channels (name) 
    VALUES (NEW.channel_name)
    ON CONFLICT (name) DO NOTHING;
    
    SELECT id INTO NEW.channel_id FROM channels WHERE name = NEW.channel_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reaction_channel_sync
BEFORE INSERT OR UPDATE ON reactions
FOR EACH ROW EXECUTE FUNCTION sync_channel_info();

-- Comment out this statement once the migration is complete
-- ALTER TABLE reactions ALTER COLUMN channel_id SET NOT NULL;