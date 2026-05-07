import { useForm } from 'react-hook-form';
import { useReservationStore } from '../store';
import { Button } from './Step1Config';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface ClientForm {
  name: string;
  phone: string;
  email: string;
}

export function Step3Client({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { client, setClient } = useReservationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<ClientForm>({
    defaultValues: client
  });

  const onSubmit = (data: ClientForm) => {
    setClient(data);
    onNext();
  };

  return (
    <div className="space-y-12 max-w-xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <button onClick={onPrev} className="p-2 border border-brand-white/20 rounded-full hover:bg-brand-white hover:text-brand-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-3xl font-display font-light">Identificação</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-8">
          <div className="relative group">
            <input 
              {...register('name', { required: 'O Nome é obrigatório' })} 
              className="input-minimal text-xl font-light" 
              placeholder="Nome Completo"
              autoComplete="off"
            />
            {errors.name && <span className="absolute -bottom-5 left-0 text-[10px] text-brand-orange uppercase tracking-widest">{errors.name.message}</span>}
          </div>

          <div className="relative group">
            <input 
              {...register('phone', { required: 'O Telefone é obrigatório' })} 
              className="input-minimal text-xl font-light" 
              placeholder="Telefone" 
              type="tel"
              autoComplete="off"
            />
            {errors.phone && <span className="absolute -bottom-5 left-0 text-[10px] text-brand-orange uppercase tracking-widest">{errors.phone.message}</span>}
          </div>

          <div className="relative group">
            <input 
              {...register('email')} 
              className="input-minimal text-xl font-light" 
              placeholder="Email (Opcional)" 
              type="email"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="pt-8">
          <Button className="w-full">
            Avançar para Pagamento <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
