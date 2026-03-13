import { create } from "zustand";
import type { Employee } from "../types";
import { persist } from "zustand/middleware";

type EmployeeStore = {
  employee: Employee;
  showModal: boolean;

  employeeSelected: (emp: Employee) => void;
  setEmployeeData: <K extends keyof Employee>(
    key: K,
    value: Employee[K],
  ) => void;
  setShowModal: (show: boolean) => void;
  reset: () => void;
};

const initialData = {
  employeesId: null,
  legalName: "HM Brandt LLC",
  employeeNumber: "",
  firstName: "",
  lastName: "",
  status: "Active",
  title: "Labor",
  user: "unknown"
};

const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set) => ({
      employee: initialData,
      showModal: false,

      employeeSelected: (emp: Employee) =>
        set({
          employee: emp,
        }),
      setEmployeeData: (key, value) =>
        set((state) => ({
          employee: {
            ...state.employee,
            [key]: value,
          },
        })),
      setShowModal: (show) => set({ showModal: show }),
      reset: () => set({ employee: initialData }),
    }),
    {
      name: "mdm-employee-storage",
    },
  ),
);

export default useEmployeeStore;
