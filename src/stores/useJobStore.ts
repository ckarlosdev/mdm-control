import { create } from "zustand";
import type { Job } from "../types";
import { persist } from "zustand/middleware";

type JobStore = {
  job: Job;
  showModal: boolean;

  jobSelected: (equip: Job) => void;
  setJobData: <K extends keyof Job>(key: K, value: Job[K]) => void;
  setShowModal: (show: boolean) => void;
  reset: () => void;
};

const initialData = {
  jobsId: null,
  number: "",
  type: "Select",
  name: "",
  address: "",
  contractor: "",
  contact: "",
  status: "Pending",
  user: "unknown",
};

const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      job: initialData,
      showModal: false,

      jobSelected: (equip: Job) =>
        set({
          job: equip,
        }),
      setJobData: (key, value) =>
        set((state) => ({
          job: {
            ...state.job,
            [key]: value,
          },
        })),
      setShowModal: (show) => set({ showModal: show }),
      reset: () => set({ job: initialData }),
    }),
    {
      name: "mdm-job-storage",
    },
  ),
);

export default useJobStore;
