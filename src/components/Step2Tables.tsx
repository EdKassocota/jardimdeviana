import { useEffect, useState } from 'react';
import { useReservationStore } from '../store';
import { Button } from './Step1Config';
import { ChevronRight, ArrowLeft, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface Table {
  id: string;
  name: string;
  maxPax: number;
  abstractPos: { x: number; y: number };
  type?: string;
  isReserved?: boolean;
}

export function Step2Tables({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { date, time, setTableId, tableId, pax } = useReservationStore();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tables & availability
    const fetchTables = async () => {
      try {
        const [tablesRes, resRes] = await Promise.all([
          fetch('/api/tables').then(r => r.json()),
          fetch('/api/reservations').then(r => r.json())
        ]);
        
        // Find reserved tables for this slot
        const getSlot = (t: string) => parseInt(t.split(':')[0]) < 17 ? 'lunch' : 'dinner';
        const targetSlot = time ? getSlot(time) : null;

        const now = new Date();

        const reservedTableIds = resRes
          .filter((r: any) => {
            if (r.date !== date || getSlot(r.time) !== targetSlot) return false;
            if (r.status === 'confirmed') return true;
            if (r.status === 'pending') {
              const createdAt = new Date(r.createdAt);
              const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
              return diffMinutes <= 10;
            }
            return false;
          })
          .map((r: any) => r.tableId);

        const processedTables = tablesRes.map((t: any) => ({
          ...t,
          isReserved: reservedTableIds.includes(t.id) || t.maxPax < pax
        }));

        setTables(processedTables);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (time) fetchTables();
  }, [date, time, pax]);

  const handleNext = () => {
    if (tableId) onNext();
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <button onClick={onPrev} className="p-2 border border-brand-white/20 rounded-full hover:bg-brand-white hover:text-brand-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-3xl font-display font-light">Planta de Mesas</h2>
      </div>

      <div className="relative w-full max-w-4xl mx-auto mt-8 border-t border-brand-white/10 pt-8">
        
        {loading ? (
          <div className="flex items-center justify-center font-display uppercase tracking-widest text-brand-white/50 text-sm py-20">A carregar mesas...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(t => {
            const isSelected = tableId === t.id;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: t.isReserved ? 0.2 : 1, scale: 1 }}
                whileHover={!t.isReserved ? { scale: 1.05 } : {}}
                disabled={t.isReserved}
                onClick={() => setTableId(t.id)}
                className={clsx(
                  "relative flex flex-col items-center justify-center transition-all duration-200 aspect-square overflow-hidden p-4",
                  isSelected ? "bg-brand-orange border border-brand-orange" : "bg-brand-white/5 border border-brand-white/10",
                  !t.isReserved && !isSelected && "hover:border-brand-orange hover:text-brand-orange",
                  t.isReserved && "cursor-not-allowed opacity-40"
                )}
              >
                <span className={clsx("font-display text-lg", isSelected ? "text-brand-black" : "")}>{t.name}</span>
                <span className={clsx("text-[10px] tracking-widest uppercase mt-2 text-center", isSelected ? "text-brand-black/80" : "text-brand-white/50")}>{t.maxPax} pessoas</span>
                {t.isReserved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-black/80 backdrop-blur-[2px]">
                    <Lock className="w-6 h-6 text-brand-white/80" />
                  </div>
                )}
              </motion.button>
            )
          })}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-brand-white/5 p-6 border border-brand-white/10 backdrop-blur-md">
        <div className="text-sm font-body text-brand-white/60 tracking-widest uppercase">
          {tableId ? tables.find(t=>t.id === tableId)?.name : "Selecione uma mesa para continuar"}
        </div>
        <Button onClick={handleNext} disabled={!tableId}>
          Detalhes <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
