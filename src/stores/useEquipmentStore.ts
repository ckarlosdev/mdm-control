import { create } from "zustand";
import type { Equipment } from "../types";
import { persist } from "zustand/middleware";

type EquipmentStore = {
  equipment: Equipment;
  showModal: boolean;
  showModalQr: boolean;

  equipmentSelected: (equip: Equipment) => void;
  setEquipmentData: <K extends keyof Equipment>(
    key: K,
    value: Equipment[K],
  ) => void;
  setShowModal: (show: boolean) => void;
  setShowModalQr: (show: boolean) => void;
  reset: () => void;
};

const getTodayDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
};

const initialData = {
  equipmentsId: null,
  family: "Equipment",
  number: "",
  name: "",
  manufacturing: "",
  model: "",
  year: "2026",
  purchaseDate: getTodayDate(),
  status: "New",
  condition: "Excellent",
  serialNumber: "",
  hour: "0.0",
};


const useEquipmentStore = create<EquipmentStore>()(
  persist(
    (set) => ({
      equipment: initialData,
      showModal: false,
      showModalQr: false,

      equipmentSelected: (equip: Equipment) =>
        set({
          equipment: equip,
        }),
      setEquipmentData: (key, value) =>
        set((state) => ({
          equipment: {
            ...state.equipment,
            [key]: value,
          },
        })),
      setShowModal: (show) => set({ showModal: show }),
      setShowModalQr: (show) => set({ showModalQr: show }),
      reset: () => set({ equipment: initialData }),
    }),
    {
      name: "mdm-equipment-storage",
    },
  ),
);

export default useEquipmentStore;