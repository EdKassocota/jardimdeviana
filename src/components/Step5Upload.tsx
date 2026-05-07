import { useState, useRef } from 'react';
import { useReservationStore } from '../store';
import { Button } from './Step1Config';
import { UploadCloud, File, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Step5Upload({ onNext }: { onNext: () => void }) {
  const { reservationId, referenceCode } = useReservationStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file || !reservationId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('proof', file);

    try {
      const res = await fetch(`/api/reservations/${reservationId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Falha no upload');
      onNext();
    } catch (e: any) {
      toast.error('Falha ao fazer upload do ficheiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-3xl font-display font-light">Upload de Comprovativo</h2>
        <p className="text-xs font-body text-brand-white/60 tracking-[0.1em] uppercase">
          Referência: <span className="text-brand-orange font-mono font-bold tracking-widest">{referenceCode}</span>
        </p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-32 border border-dashed border-subtle hover:border-brand-orange bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
      >
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        
        {file ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-[11px] uppercase tracking-wider text-brand-orange">{file.name}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-muted group-hover:text-brand-orange transition-colors">
            <UploadCloud className="w-5 h-5 mb-2" />
            <div className="text-[11px] uppercase tracking-wider">Upload de Comprovativo</div>
          </div>
        )}
      </div>

      <div className="pt-8">
        <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
          {loading ? 'A efectuar upload...' : 'Confirmar Upload'}
        </Button>
      </div>
    </div>
  );
}
