import { create } from "zustand";
import type { RegisterRequest, User } from "../types";
import { persist } from "zustand/middleware";
import { generatePassword } from "../utils/utils";

type UserStore = {
  user: User;
  userCreation: RegisterRequest;
  showModalUpdate: boolean;
  showModalCreate: boolean;
  showModalPassword: boolean;
  tempPassword: string;

  setShowModalUpdate: (show: boolean) => void;
  setShowModalCreate: (show: boolean) => void;
  setShowModalPassword: (show: boolean) => void;
  userSelected: (attach: User) => void;
  setTempPassword: (pass: string) => void;
  setUserData: <K extends keyof User>(key: K, value: User[K]) => void;
  setUserDataCreation: <K extends keyof RegisterRequest>(
    key: K,
    value: RegisterRequest[K],
  ) => void;
  resetUpdate: () => void;
  resetCreation: () => void;
};

const initialData = {
  id: "0",
  email: "",
  firstName: "",
  lastName: "",
  isActive: true,
  roles: ["ROLE_USER"],
};

const pass = generatePassword({
  length: 8,
  includeSymbols: false,
});

const initialDataRegistration = {
  email: "",
  password: pass,
  firstName: "",
  lastName: "",
  roles: ["ROLE_USER"],
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialData,
      userCreation: initialDataRegistration,
      showModalUpdate: false,
      showModalCreate: false,
      showModalPassword: false,
      tempPassword: "",

      setShowModalUpdate: (show) => set({ showModalUpdate: show }),
      setShowModalCreate: (show) => set({ showModalCreate: show }),
      setShowModalPassword: (show) => set({ showModalPassword: show }),
      userSelected: (attach: User) =>
        set({
          user: attach,
        }),
      setTempPassword: (pass) => set({ tempPassword: pass }),
      setUserData: (key, value) =>
        set((state) => ({
          user: {
            ...state.user,
            [key]: value,
          },
        })),

      setUserDataCreation: (key, value) =>
        set((state) => ({
          userCreation: {
            ...state.userCreation,
            [key]: value,
          },
        })),
      resetUpdate: () => set({ user: initialData }),
      resetCreation: () => set({ userCreation: initialDataRegistration }),
    }),
    {
      name: "mdm-user-storage",
    },
  ),
);

export default useUserStore;
