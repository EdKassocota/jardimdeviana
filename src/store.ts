import { create } from 'zustand';

export interface ReservationState {
  date: string | null;
  time: string | null;
  pax: number;
  tableId: string | null;
  client: { name: string; phone: string; email: string };
  reservationId: string | null;
  referenceCode: string | null;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setPax: (pax: number) => void;
  setTableId: (id: string) => void;
  setClient: (client: { name: string; phone: string; email: string }) => void;
  setReservationDetails: (id: string, ref: string) => void;
  reset: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  date: null,
  time: null,
  pax: 2,
  tableId: null,
  client: { name: '', phone: '', email: '' },
  reservationId: null,
  referenceCode: null,
  
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setPax: (pax) => set({ pax }),
  setTableId: (id) => set({ tableId: id }),
  setClient: (client) => set({ client }),
  setReservationDetails: (id, ref) => set({ reservationId: id, referenceCode: ref }),
  reset: () => set({
    date: null, time: null, pax: 2, tableId: null,
    client: { name: '', phone: '', email: '' },
    reservationId: null, referenceCode: null
  })
}));
