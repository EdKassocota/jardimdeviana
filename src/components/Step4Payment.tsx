import { useState } from 'react';
import { useReservationStore } from '../store';
import { Button } from './Step1Config';
import { ChevronRight, ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';

export function Step4Payment({ onNext }: { onNext: () => void }) {
  const { date, time, pax, tableId, client, setReservationDetails } = useReservationStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'iban' | 'mcx'>('iban');
  const [localReferenceCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());

  const amount = (pax * 10000).toLocaleString('pt-PT');

  // Bank Info (Mock)
  const bankInfo = {
    bank: "BIC Angola",
    iban: "AO06.0000.0000.0000.0000.0000.0",
    name: "Jardim Viana Lda",
    mcxPhone: "900 000 000",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copiado para a área de transferência");
  };

  const createReservation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, pax, tableId, client, referenceCode: localReferenceCode })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao criar reserva');

      setReservationDetails(data.id, data.referenceCode);
      onNext();
    } catch (e: any) {
      toast.error(e.message || "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-display font-light">Pagamento & Confirmação</h2>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-body text-white tracking-widest uppercase leading-relaxed bg-brand-orange/10 border border-brand-orange/30 p-4">
          <span className="text-brand-orange font-bold">Nota:</span> O valor pago pela reserva ({amount} Kz - referente a 10.000 Kz por pessoa) será deduzido do seu consumo total no restaurante.
        </p>
        <p className="text-[11px] font-body text-muted tracking-widest uppercase leading-relaxed">
          Para finalizar a sua reserva, é necessário efetuar o pagamento. A sua mesa ficará pendente até efectuar o upload do comprovativo.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPaymentMethod('iban')}
          className={clsx(
            "flex-1 py-3 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200",
            paymentMethod === 'iban' ? "border-brand-orange text-brand-orange" : "border-subtle text-muted hover:border-white/30 hover:text-white"
          )}
        >
          Transferência (IBAN)
        </button>
        <button
          onClick={() => setPaymentMethod('mcx')}
          className={clsx(
            "flex-1 py-3 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200",
            paymentMethod === 'mcx' ? "border-brand-orange text-brand-orange" : "border-subtle text-muted hover:border-white/30 hover:text-white"
          )}
        >
          Multicaixa Express
        </button>
      </div>

      <div className="bg-white/5 p-5 border border-white/10 space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <label className="text-[10px] uppercase text-muted block">Valor a Pagar</label>
          <div className="font-mono text-xl text-brand-orange">{amount} Kz</div>
        </div>

        {paymentMethod === 'iban' ? (
          <>
            <div>
              <label className="text-[10px] uppercase text-muted mb-1 block">Banco / Beneficiário</label>
              <div className="font-display text-lg">{bankInfo.bank}</div>
              <div className="text-sm mt-1">{bankInfo.name}</div>
            </div>
            
            <div>
               <label className="text-[10px] uppercase text-muted mb-1 block">IBAN</label>
               <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                 <div className="font-mono text-sm tracking-tighter">{bankInfo.iban}</div>
                 <button onClick={() => copyToClipboard(bankInfo.iban)} className="text-[9px] border border-brand-orange/40 text-brand-orange px-2 py-1 uppercase opacity-80 hover:bg-brand-orange hover:text-black transition-colors">
                   Copiar
                 </button>
               </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-[10px] uppercase text-muted mb-1 block">Beneficiário</label>
              <div className="font-display text-lg">{bankInfo.name}</div>
            </div>
            
            <div>
               <label className="text-[10px] uppercase text-muted mb-1 block">Número de Telefone (Multicaixa Express)</label>
               <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                 <div className="font-mono text-sm tracking-tighter">{bankInfo.mcxPhone}</div>
                 <button onClick={() => copyToClipboard(bankInfo.mcxPhone)} className="text-[9px] border border-brand-orange/40 text-brand-orange px-2 py-1 uppercase opacity-80 hover:bg-brand-orange hover:text-black transition-colors">
                   Copiar
                 </button>
               </div>
            </div>
          </>
        )}

        <div className="bg-brand-orange/10 border border-brand-orange/30 p-4 mt-4">
          <label className="text-[10px] uppercase text-brand-orange mb-2 block font-bold">Importante: Código de Referência</label>
          <div className="text-[11px] text-white leading-relaxed mb-3">
             Por favor, coloque este código obrigatoriamente na <span className="font-bold">descrição/detalhes</span> do seu pagamento {paymentMethod === 'iban' ? 'no Internet Banking' : 'na app Multicaixa Express'} para que possamos identificar a sua reserva.
          </div>
          <div className="flex items-center justify-between border-t border-brand-orange/20 pt-3">
            <div className="font-mono text-lg tracking-widest text-brand-orange font-bold">{localReferenceCode}</div>
            <button onClick={() => copyToClipboard(localReferenceCode)} className="text-[9px] border border-brand-orange/40 text-brand-orange px-2 py-1 uppercase opacity-80 hover:bg-brand-orange hover:text-black transition-colors">
              Copiar
            </button>
          </div>
        </div>
      </div>

        <div className="pt-8">
          <Button onClick={createReservation} disabled={loading} className="w-full">
            {loading ? 'A processar...' : 'Já efectuei o pagamento'} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
    </div>
  );
}
