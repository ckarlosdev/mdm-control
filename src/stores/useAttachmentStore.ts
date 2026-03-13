import { create } from "zustand";
import type { Attachment } from "../types";
import { persist } from "zustand/middleware";

type AttachmentStore = {
  attachment: Attachment;
  showModal: boolean;
  showModalQr: boolean;

  attachmentSelected: (attach: Attachment) => void;
  setAttachmentData: <K extends keyof Attachment>(
    key: K,
    value: Attachment[K],
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
  attachmentsId: null,
  family: "Attachment",
  number: "",
  name: "",
  manufacturing: "",
  model: "",
  year: "2026",
  purchaseDate: getTodayDate(),
  status: "New",
  conditions: "Excellent",
  serialNumber: "",
  user: "unknown",
};

const useAttachmentStore = create<AttachmentStore>()(
  persist(
    (set) => ({
      attachment: initialData,
      showModal: false,
      showModalQr: false,

      attachmentSelected: (attach: Attachment) =>
        set({
          attachment: attach,
        }),
      setAttachmentData: (key, value) =>
        set((state) => ({
          attachment: {
            ...state.attachment,
            [key]: value,
          },
        })),
      setShowModal: (show) => set({ showModal: show }),
      setShowModalQr: (show) => set({ showModalQr: show }),
      reset: () => set({ attachment: initialData }),
    }),
    {
      name: "mdm-attachment-storage",
    },
  ),
);

export default useAttachmentStore;
