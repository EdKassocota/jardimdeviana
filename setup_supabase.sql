-- Run this script in the Supabase SQL Editor to create the necessary table and storage for the reservations.

-- Create reservations table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  pax integer NOT NULL,
  client jsonb NOT NULL,
  reference_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  proof_file text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Storage and create public bucket for proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Configure storage policies to allow public access (since the backend acts as a bridge for now, but good to have)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'proofs');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proofs');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'proofs');
