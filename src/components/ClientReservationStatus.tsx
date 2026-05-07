import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './Step1Config';
import { Search, Info, CheckCircle2, XCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

export function ClientReservationStatus() {
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refCode.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reservations/search?q=${encodeURIComponent(refCode.trim())}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Reserva não encontrada. Verifique o código ou nome fornecido.');
        } else {
          toast.error('Ocorreu um erro a procurar a reserva.');
        }
        return;
      }
      const data = await res.json();
      setReservation(data);
    } catch (err) {
      toast.error('Ocorreu um erro de rede.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `reserva-${reservation.referenceCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating receipt', err);
      toast.error('Erro ao gerar recibo.');
    } finally {
      setDownloading(false);
    }
  };

  const statusIcons: any = {
    pending: <Info className="w-8 h-8 text-white/50" />,
    confirmed: <CheckCircle2 className="w-8 h-8 text-brand-orange" />,
    rejected: <XCircle className="w-8 h-8 text-red-500" />
  };

  const statusLabels: any = {
    pending: 'Aguardando Confirmação',
    confirmed: 'Reserva Confirmada',
    rejected: 'Reserva Rejeitada'
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 mb-2">Acompanhamento</h2>
        <h1 className="text-4xl md:text-5xl font-display font-normal">
          A Minha <span className="italic font-serif opacity-70">Reserva</span>
        </h1>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Código de Referência ou Nome"
          value={refCode}
          onChange={e => setRefCode(e.target.value)}
          className="flex-1 bg-brand-black border border-brand-white/20 p-4 font-mono tracking-widest text-center sm:text-left focus:outline-none focus:border-brand-orange transition-colors uppercase"
        />
        <Button onClick={handleSearch} disabled={loading || !refCode.trim()} className="w-full sm:w-auto">
          {loading ? 'A Procurar...' : <><Search className="w-4 h-4" /> Buscar</>}
        </Button>
      </form>

      {reservation && (
        <div className="pt-8 border-t border-brand-white/10 animate-fade-in flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
            {statusIcons[reservation.status]}
            <div className="text-xl font-display tracking-widest uppercase">
              {statusLabels[reservation.status]}
            </div>
          </div>

          {reservation.status === 'confirmed' ? (
            <>
              {/* Printable Receipt */}
              <div 
                ref={receiptRef}
                className="relative w-full max-w-sm p-8 text-left mb-8 overflow-hidden mx-auto"
                style={{ backgroundColor: 'rgba(245, 245, 245, 0.05)', borderColor: 'rgba(245, 245, 245, 0.2)', borderWidth: '1px' }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 3.83L18.17 19H5.83L12 5.83z"/>
                  </svg>
                </div>

                <div className="uppercase tracking-[0.2em] text-[10px] text-brand-orange mb-6 font-bold">
                  Ticket de reserva - Jardim de viana
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Cliente</div>
                    <div className="font-semibold text-brand-white">{reservation.client?.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Data</div>
                      <div className="text-brand-white">{reservation.date}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Hora</div>
                      <div className="text-brand-white">{reservation.time}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Pessoas</div>
                      <div className="text-brand-white">{reservation.pax} pax</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Mesa</div>
                      <div className="text-brand-white uppercase">{reservation.tableId}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6" style={{ borderTopWidth: '1px', borderTopStyle: 'dashed', borderColor: 'rgba(245, 245, 245, 0.2)' }}>
                  <div className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-2">Ref. Reserva</div>
                  <div className="text-2xl font-mono tracking-[0.2em] text-brand-orange font-bold">
                    {reservation.referenceCode}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4 mx-auto">
                <Button onClick={downloadReceipt} variant="primary" disabled={downloading}>
                  {downloading ? 'A GERAR RECIBO...' : 'DESCARREGAR RECIBO'}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm tracking-widest uppercase opacity-50 max-w-md">
              {reservation.status === 'pending' 
                ? 'O seu ticket com código QR/referência será gerado nesta página assim que a administração confirmar a sua reserva.' 
                : 'Lamentamos, mas a sua reserva foi rejeitada.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
