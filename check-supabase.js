import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL || 'https://zuzumoowrdbbmhrhmrfc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_F6KSNwH1i92Fb42ct1pDBg_SXcatb7d';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const tables = JSON.parse(fs.readFileSync('./tables.json', 'utf-8'));
  const dbTables = tables.map((t) => ({
    id: t.id,
    name: t.name,
    max_pax: t.maxPax,
    abstract_pos: t.abstractPos,
    type: t.type
  }));

  const { error } = await supabase.from('restaurant_tables').upsert(dbTables);
  if (error) {
    console.error("Upsert error:", error);
  } else {
    console.log("Successfully seeded", dbTables.length, "tables to Supabase.");
  }
}
seed();
