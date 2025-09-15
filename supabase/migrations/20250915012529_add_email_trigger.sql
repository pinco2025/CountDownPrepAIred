-- Enable the pg_net extension for HTTP requests first
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the waitlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  serial_number BIGSERIAL
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for the waitlist form)
CREATE POLICY "Allow anonymous inserts on waitlist" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow all operations for authenticated users (for admin)
CREATE POLICY "Allow all operations for authenticated users" ON waitlist
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to send webhook to Edge Function
CREATE OR REPLACE FUNCTION send_welcome_email_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- Only proceed for INSERT operations
  IF TG_OP = 'INSERT' THEN
    -- Get the webhook URL from environment or set it directly
    -- Replace 'your-project-ref' with your actual Supabase project reference
    webhook_url := 'https://pgtrazmbujllsogayvqn.supabase.co/functions/v1/send-welcome-email-sendgrid';
    
    -- Create the payload
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW),
      'old_record', NULL
    );
    
    -- Make the HTTP request to the Edge Function
    PERFORM
      net.http_post(
        url := webhook_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := payload
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_waitlist_insert ON waitlist;
CREATE TRIGGER on_waitlist_insert
  AFTER INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_webhook();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO anon, authenticated;
GRANT EXECUTE ON FUNCTION net.http_post TO anon, authenticated;