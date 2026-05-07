import { useReservationStore } from '../store';
import { Button } from './Step1Config';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export function Step6Confirm({ onReset }: { onReset: () => void }) {
  const { referenceCode, reset } = useReservationStore();

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <div className="max-w-xl mx-auto w-full text-center flex flex-col items-center">
      <div className="w-24 h-24 border border-brand-orange rounded-full flex items-center justify-center text-brand-orange mb-8">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-4xl md:text-5xl font-display font-light mb-4">
        Reserva <span className="text-brand-orange italic font-serif">Recebida</span>
      </h2>

      <p className="text-sm font-body text-brand-white/60 tracking-[0.1em] uppercase max-w-sm mx-auto leading-relaxed mb-12">
        A sua reserva encontra-se pendente de validação pela nossa equipa. Receberá uma notificação em breve. Pode utilizar este código para acompanhar o estado da sua reserva na aba "A Minha Reserva".
      </p>

      <div className="py-8 w-full">
        <div className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-2">Código de Referência</div>
        <div className="text-3xl font-mono tracking-[0.2em] text-brand-orange bg-brand-orange/10 py-4 px-8 border border-brand-orange/20 max-w-sm mx-auto">
          {referenceCode}
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 pt-8">
        <Button onClick={handleReset} variant="secondary">
          VOLTAR AO INÍCIO
        </Button>
      </div>
    </div>
  );
}
