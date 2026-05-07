import 'dotenv/config';
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || 'https://zuzumoowrdbbmhrhmrfc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_F6KSNwH1i92Fb42ct1pDBg_SXcatb7d';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const TABLES_FILE = path.join(__dirname, "tables.json");
const defaultTables = [
  { id: "t1", name: "Mesa 1", maxPax: 2, abstractPos: { x: 20, y: 20 } },
  { id: "t2", name: "Mesa 2", maxPax: 2, abstractPos: { x: 20, y: 50 } },
  { id: "t3", name: "Mesa 3", maxPax: 4, abstractPos: { x: 50, y: 35 } },
  { id: "t4", name: "Mesa 4", maxPax: 4, abstractPos: { x: 80, y: 20 } },
  { id: "t5", name: "Mesa 5", maxPax: 6, abstractPos: { x: 80, y: 50 } },
  { id: "t6", name: "Lounge 1", maxPax: 8, abstractPos: { x: 50, y: 80 }, type: 'lounge' },
];

if (!fs.existsSync(TABLES_FILE)) {
  fs.writeFileSync(TABLES_FILE, JSON.stringify(defaultTables, null, 2));
}

app.use("/uploads", express.static(UPLOADS_DIR));

const upload = multer({ dest: UPLOADS_DIR });

// --- Mock Database ---
export type ReservationStatus = "pending" | "confirmed" | "rejected";

export interface Reservation {
  id: string;
  tableId: string;
  date: string; // YYYY-MM-DD
  time: string;
  pax: number;
  client: {
    name: string;
    phone: string;
    email?: string;
  };
  proofFile?: string; // filename
  referenceCode: string;
  status: ReservationStatus;
  createdAt: string;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/reservations", async (req, res) => {
  const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  const formatted = data.map(r => ({
    ...r,
    tableId: r.table_id,
    proofFile: r.proof_file,
    referenceCode: r.reference_code,
    createdAt: r.created_at,
  }));
  res.json(formatted);
});

app.get("/api/reservations/search", async (req, res) => {
  const q = req.query.q as string;
  if (!q) {
    return res.status(400).json({ error: "Query obrigatória." });
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .or(`reference_code.ilike.%${q}%,client->>name.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Reserva não encontrada." });
  }

  const reservation = data[0];

  res.json({
    ...reservation,
    tableId: reservation.table_id,
    proofFile: reservation.proof_file,
    referenceCode: reservation.reference_code,
    createdAt: reservation.created_at,
  });
});

app.get("/api/reservations/ref/:referenceCode", async (req, res) => {
  const { referenceCode } = req.params;
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .ilike('reference_code', referenceCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }
    return res.status(500).json({ error: error.message });
  }

  res.json({
    ...data,
    tableId: data.table_id,
    proofFile: data.proof_file,
    referenceCode: data.reference_code,
    createdAt: data.created_at,
  });
});

app.post("/api/reservations", async (req, res) => {
  const { tableId, date, time, pax, client } = req.body;
  
  // Check conflicts (reserve entire period lunch/dinner)
  const getSlot = (t: string) => parseInt(t.split(':')[0]) < 17 ? 'lunch' : 'dinner';
  const targetSlot = getSlot(time);
  
  const { data: existing, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('table_id', tableId)
    .eq('date', date)
    .neq('status', 'rejected');
    
  if (fetchError) {
    console.error("Supabase fetch error:", fetchError.message);
    return res.status(500).json({ error: "Erro de permissão no Supabase: RLS ativado ou chave sem permissão." });
  }

  const conflict = (existing || []).find(r => getSlot(r.time) === targetSlot);
  if (conflict) {
    return res.status(400).json({ error: "Table already reserved for this slot." });
  }

  const referenceCode = req.body.referenceCode || uuidv4().split('-')[0].toUpperCase();

  const { data: reservation, error: insertError } = await supabase
    .from('reservations')
    .insert([{
      table_id: tableId,
      date,
      time,
      pax,
      client,
      reference_code: referenceCode,
      status: "pending"
    }])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase insert error:", insertError.message);
    return res.status(500).json({ error: "Erro de permissão no Supabase: RLS ativado ou chave sem permissão." });
  }

  res.status(201).json({
    ...reservation,
    tableId: reservation.table_id,
    referenceCode: reservation.reference_code,
    createdAt: reservation.created_at
  });
});

app.post("/api/reservations/:id/upload", upload.single("proof"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;
  const fileExt = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExt}`;
  
  try {
    const fileBuffer = fs.readFileSync(file.path);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false
      });

    fs.unlinkSync(file.path);

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage.from('proofs').getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    const { data: updated, error: updateError } = await supabase
      .from('reservations')
      .update({ proof_file: publicUrl })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (updateError) {
      console.error("Supabase update error:", updateError.message);
      return res.status(500).json({ error: "Erro ao atualizar comprovativo." });
    }

    res.json({
      ...updated,
      tableId: updated.table_id,
      proofFile: updated.proof_file,
      referenceCode: updated.reference_code,
      createdAt: updated.created_at
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/reservations/:id/status", async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

  if (error) {
    console.error("Supabase update status error:", error.message);
    return res.status(500).json({ error: "Erro ao atualizar estado da reserva." });
  }

  res.json({
    ...data,
    tableId: data.table_id,
    proofFile: data.proof_file,
    referenceCode: data.reference_code,
    createdAt: data.created_at
  });
});

// Admin stats
app.get("/api/tables", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(TABLES_FILE, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read tables" });
  }
});

app.post("/api/tables", (req, res) => {
  try {
    const tables = req.body;
    fs.writeFileSync(TABLES_FILE, JSON.stringify(tables, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save tables" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
