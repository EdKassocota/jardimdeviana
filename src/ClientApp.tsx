import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReservationStore } from './store';
import { Step1Config } from './components/Step1Config';
import { Step2Tables } from './components/Step2Tables';
import { Step3Client } from './components/Step3Client';
import { Step4Payment } from './components/Step4Payment';
import { Step5Upload } from './components/Step5Upload';
import { Step6Confirm } from './components/Step6Confirm';
import { ClientReservationStatus } from './components/ClientReservationStatus';

export function ClientApp() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'new' | 'status'>('new');

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const content = mode === 'status' ? (
    <motion.div
      key="status"
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col justify-center"
    >
      <ClientReservationStatus />
    </motion.div>
  ) : (
    <motion.div
      key={`step-${step}`}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col justify-center"
    >
      {step === 1 && <Step1Config onNext={nextStep} />}
      {step === 2 && <Step2Tables onNext={nextStep} onPrev={prevStep} />}
      {step === 3 && <Step3Client onNext={nextStep} onPrev={prevStep} />}
      {step === 4 && <Step4Payment onNext={nextStep} />}
      {step === 5 && <Step5Upload onNext={nextStep} />}
      {step === 6 && <Step6Confirm onReset={() => setStep(1)} />}
    </motion.div>
  );

  return (
    <div className="flex-1 flex flex-col w-full h-full justify-center max-w-[1024px] mx-auto pt-32 px-6 pb-20">
      
      <div className="flex justify-center gap-8 mb-12 border-b border-brand-white/10 pb-4">
        <button 
          onClick={() => { setMode('new'); setStep(1); }} 
          className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${mode === 'new' ? 'text-brand-orange' : 'text-brand-white/50 hover:text-brand-white'}`}
        >Nova Reserva</button>
        <button 
          onClick={() => setMode('status')} 
          className={`uppercase tracking-[0.2em] text-xs font-bold transition-colors ${mode === 'status' ? 'text-brand-orange' : 'text-brand-white/50 hover:text-brand-white'}`}
        >A Minha Reserva</button>
      </div>

      <AnimatePresence mode="wait">
        {content}
      </AnimatePresence>
    </div>
  );
}
