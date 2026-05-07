import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Eye, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { AdminTables } from './components/AdminTables';

export function AdminApp() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofModalUrl, setProofModalUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'reservations' | 'tables'>('reservations');

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(data.reverse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      toast.success(status === 'finished' ? 'Mesa libertada' : `Reserva ${status === 'confirmed' ? 'confirmada' : 'rejeitada'}`);
      fetchReservations();
    } catch (e) {
      toast.error('Falha ao atualizar o estado');
    }
  };

  const statusColors: any = {
    pending: 'text-yellow-500 border-yellow-500/30',
    confirmed: 'text-green-500 border-green-500/30',
    rejected: 'text-red-500 border-red-500/30',
    finished: 'text-blue-500 border-blue-500/30'
  };

  const statusNames: any = {
    pending: 'pendente',
    confirmed: 'confirmada',
    rejected: 'rejeitada',
    finished: 'concluída'
  };

  const filteredReservations = reservations.filter(res => {
    if (res.status === 'finished') return false;
    const query = searchQuery.toLowerCase();
    const nameMatch = res.client?.name?.toLowerCase().includes(query);
    const refMatch = res.referenceCode?.toLowerCase().includes(query);
    return nameMatch || refMatch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-10 space-y-12 pt-32 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-brand-white/10 pb-6">
        <h2 className="text-3xl font-display font-light">
          Gestão de <span className="text-brand-orange italic font-serif">Backoffice</span>
        </h2>
        {currentTab === 'reservations' && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Pesquisar por nome ou ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-black border border-brand-white/20 rounded-none py-2 px-4 text-sm tracking-widest text-brand-white placeholder:text-brand-white/40 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 border-b border-brand-white/10 pb-4">
        <button 
          onClick={() => setCurrentTab('reservations')} 
          className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${currentTab === 'reservations' ? 'text-brand-orange' : 'text-brand-white/50 hover:text-brand-white'}`}
        >Reservas</button>
        <button 
          onClick={() => setCurrentTab('tables')} 
          className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${currentTab === 'tables' ? 'text-brand-orange' : 'text-brand-white/50 hover:text-brand-white'}`}
        >Gerir Mesas</button>
      </div>

      {currentTab === 'tables' ? (
        <AdminTables />
      ) : loading ? (
        <div className="text-sm tracking-widest uppercase opacity-50">A carregar registos...</div>
      ) : (
        <div className="flex flex-col space-y-4">
          {filteredReservations.length === 0 && (
            <div className="text-center py-20 border border-dashed border-brand-white/20 text-brand-white/50 tracking-widest uppercase text-xs">
              Nenhuma reserva encontrada
            </div>
          )}
          {filteredReservations.map(res => (
            <div key={res.id} className="border border-brand-white/10 bg-brand-white/5 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <span className="font-mono text-brand-orange text-lg break-all">{res.referenceCode}</span>
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 border rounded-full text-center ${statusColors[res.status]}`}>
                    {statusNames[res.status] || res.status}
                  </span>
                </div>
                <div className="text-xl font-display text-center md:text-left">{res.client.name}</div>
                <div className="text-sm font-body text-brand-white/60 tracking-wider text-center md:text-left">
                  {res.client.phone} {res.client.email && `• ${res.client.email}`}
                </div>
              </div>

              <div className="space-y-1 text-center md:text-right w-full md:w-auto">
                <div className="text-sm tracking-widest uppercase">{res.date} • {res.time}</div>
                <div className="text-sm font-body text-brand-white/60 tracking-wider">
                  Mesa: {res.tableId} • Pessoas: {res.pax}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end flex-wrap">
                {res.proofFile && (
                  <button onClick={() => setProofModalUrl(res.proofFile.startsWith('http') ? res.proofFile : `/uploads/${res.proofFile}`)} className="flex items-center gap-2 px-4 py-2 border border-brand-white/20 hover:bg-brand-white hover:text-brand-black transition-colors text-xs uppercase tracking-widest rounded-full">
                    <Eye className="w-4 h-4" /> Comprovativo
                  </button>
                )}
                {res.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(res.id, 'confirmed')} className="flex items-center justify-center w-10 h-10 border border-green-500/50 text-green-500 hover:bg-green-500 hover:text-black rounded-full transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => updateStatus(res.id, 'rejected')} className="flex items-center justify-center w-10 h-10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black rounded-full transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                {res.status === 'confirmed' && (
                  <button onClick={() => updateStatus(res.id, 'finished')} className="flex items-center gap-2 px-4 py-2 border border-brand-white/20 text-brand-white hover:bg-brand-white hover:text-brand-black transition-colors text-xs uppercase tracking-widest rounded-full">
                    <Unlock className="w-4 h-4" /> Liberar Mesa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {proofModalUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setProofModalUrl(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex items-center gap-4">
              <a href={proofModalUrl} target="_blank" rel="noreferrer" className="text-white hover:text-brand-orange transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                Abrir no navegador
              </a>
              <button onClick={() => setProofModalUrl(null)} className="text-white hover:text-brand-orange transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                Fechar <X className="w-6 h-6" />
              </button>
            </div>
            {proofModalUrl.match(/\.(pdf|doc|docx)(\?.*)?$/i) ? (
              <div className="w-full h-[40vh] bg-brand-black border border-white/10 rounded-lg flex flex-col items-center justify-center p-8 text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Ficheiro de Documento</h3>
                  <p className="text-sm text-white/50 max-w-md">Para evitar bloqueios do navegador, por favor abra este documento num novo separador.</p>
                </div>
                <a href={proofModalUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-brand-orange text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                  Ver Documento
                </a>
              </div>
            ) : (
              <img src={proofModalUrl} alt="Comprovativo" className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-black" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
