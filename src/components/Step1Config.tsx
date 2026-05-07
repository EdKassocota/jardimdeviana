import { format, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useReservationStore } from '../store';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Premium Button component
export function Button({ children, onClick, className, disabled, variant = 'primary' }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "group relative flex items-center justify-center gap-4 py-5 px-8",
        "uppercase tracking-[0.2em] text-sm font-bold transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed w-full",
        variant === 'primary' 
          ? "bg-brand-orange text-black hover:bg-[#D66D1D]" 
          : "border border-subtle hover:border-brand-orange text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Step1Config({ onNext }: { onNext: () => void }) {
  const { date, time, pax, setDate, setTime, setPax } = useReservationStore();

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  const handleNext = () => {
    if (date && time) onNext();
  };

  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 mb-2">Escolha da Reserva</h2>
        <h1 className="text-4xl md:text-5xl font-display font-normal">
          Reserva de <span className="italic font-serif opacity-70">Mesa</span>
        </h1>
      </div>

      <div className="space-y-12 max-w-2xl">
        {/* Horizontal scroll date selector */}
        <div className="space-y-6">
          <label className="text-[10px] uppercase text-muted">Data Seleccionada</label>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {dates.map(d => {
              const dStr = format(d, 'yyyy-MM-dd');
              const isSelected = date === dStr;
              return (
                <button
                  key={dStr}
                  onClick={() => setDate(dStr)}
                  className={clsx(
                    "flex flex-col items-center flex-none w-20 py-4 transition-all duration-300",
                    "border",
                    isSelected 
                      ? "border-brand-orange text-brand-orange" 
                      : "border-subtle hover:border-white/30 text-muted"
                  )}
                >
                  <span className="text-xs uppercase tracking-widest mb-2">{format(d, 'EEE', { locale: pt })}</span>
                  <span className="text-2xl font-display font-light">{format(d, 'dd')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time selector */}
        <div className="space-y-6">
          <label className="text-[10px] uppercase text-muted">Hora</label>
          
          <div className="space-y-4">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-brand-white/40 mb-2">Almoço</div>
              <div className="flex flex-wrap gap-3">
                {['12:00', '12:30', '13:00', '13:30', '14:00'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={clsx(
                      "py-2 px-4 uppercase tracking-[0.05em] text-[11px] transition-all duration-200 border",
                      time === t
                        ? "border-brand-orange text-brand-orange"
                        : "border-subtle hover:border-white/30 text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-widest text-brand-white/40 mb-2 mt-4">Jantar</div>
              <div className="flex flex-wrap gap-3">
                {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={clsx(
                      "py-2 px-4 uppercase tracking-[0.05em] text-[11px] transition-all duration-200 border",
                      time === t
                        ? "border-brand-orange text-brand-orange"
                        : "border-subtle hover:border-white/30 text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pax selector */}
        <div className="space-y-6">
          <label className="text-[10px] uppercase text-muted">Pessoas</label>
          <div className="flex gap-4">
            {[2, 4, 6, 8].map(guests => (
              <button
                key={guests}
                onClick={() => setPax(guests)}
                className={clsx(
                  "flex-1 py-3 uppercase tracking-[0.05em] text-[12px] transition-all duration-200 border",
                  pax === guests
                    ? "border-brand-orange text-brand-orange"
                    : "border-subtle hover:border-white/30 text-white"
                )}
              >
                {guests}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <Button onClick={handleNext} disabled={!date || !time} className="w-full sm:w-auto">
            Escolher Mesa <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
