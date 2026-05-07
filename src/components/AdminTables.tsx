import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Table {
  id: string;
  name: string;
  maxPax: number;
  abstractPos: { x: number; y: number };
  type?: string;
}

export function AdminTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Table>>({});

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (e) {
      toast.error('Erro ao buscar mesas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const saveTables = async (newTables: Table[]) => {
    try {
      await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTables),
      });
      setTables(newTables);
      toast.success('Mesas atualizadas');
    } catch (e) {
      toast.error('Erro ao salvar mesas');
    }
  };

  const handleAdd = () => {
    const newTable: Table = {
      id: `t${Date.now()}`,
      name: `Mesa ${tables.length + 1}`,
      maxPax: 2,
      abstractPos: { x: 50, y: 50 }
    };
    saveTables([...tables, newTable]);
  };

  const confirmDelete = (id: string) => {
    saveTables(tables.filter(t => t.id !== id));
    setDeletingId(null);
  };

  const startEdit = (t: Table) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const newTables = tables.map(t => t.id === editingId ? { ...t, ...editForm } as Table : t);
    saveTables(newTables);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-white/5 p-6 border border-brand-white/10">
        <div>
          <h3 className="text-xl font-display font-light">Mesas do Restaurante</h3>
          <p className="text-xs tracking-widest uppercase opacity-50 mt-1">Gerencie a planta e lotação</p>
        </div>
        <button onClick={handleAdd} className="w-full sm:w-auto px-4 py-2 bg-brand-orange text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors">
          <Plus className="w-4 h-4" /> Adicionar Mesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-sm opacity-50 tracking-widest uppercase">Carregando mesas...</div>
        ) : (
          tables.map(t => (
            <div key={t.id} className="border border-brand-white/10 bg-brand-white/5 p-4 flex flex-col gap-4">
              {editingId === t.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase opacity-50">Nome da Mesa</label>
                    <input 
                      type="text" 
                      value={editForm.name || ''} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-brand-black border border-brand-white/20 p-2 text-sm mt-1 focus:border-brand-orange outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] tracking-widest uppercase opacity-50">Lotação Máx</label>
                      <input 
                        type="number" 
                        value={editForm.maxPax || 0} 
                        onChange={e => setEditForm({...editForm, maxPax: parseInt(e.target.value)})}
                        className="w-full bg-brand-black border border-brand-white/20 p-2 text-sm mt-1 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] tracking-widest uppercase opacity-50">Tipo</label>
                      <select 
                        value={editForm.type || 'standard'} 
                        onChange={e => setEditForm({...editForm, type: e.target.value})}
                        className="w-full bg-brand-black border border-brand-white/20 p-2 text-sm mt-1 focus:border-brand-orange outline-none"
                      >
                        <option value="standard">Normal</option>
                        <option value="lounge">Lounge</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveEdit} className="flex-1 bg-brand-white text-black py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-orange transition-colors">
                      <Save className="w-3 h-3" /> Salvar
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex-1 border border-brand-white/20 py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-brand-orange transition-colors">
                      <X className="w-3 h-3" /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-display text-lg">{t.name}</div>
                      <div className="text-xs tracking-widest uppercase opacity-50 mt-1">{t.maxPax} Pessoas {t.type === 'lounge' ? '• Lounge' : ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(t)} className="text-brand-white/50 hover:text-brand-orange transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deletingId === t.id ? (
                        <>
                          <button onClick={() => confirmDelete(t.id)} className="text-red-500 font-bold uppercase text-[10px]">Apagar</button>
                          <button onClick={() => setDeletingId(null)} className="text-brand-white/50 uppercase text-[10px]">Cancelar</button>
                        </>
                      ) : (
                        <button onClick={() => setDeletingId(t.id)} className="text-brand-white/50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
