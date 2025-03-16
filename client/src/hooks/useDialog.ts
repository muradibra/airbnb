import { create } from "zustand";

export enum DialogTypeEnum {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  CREATE_LISTING = "CREATE_LISTING",
  EDIT_LISTING = "EDIT_LISTING",
  // FORGOT_PASSWORD = "FORGOT_PASSWORD",
  // RESET_PASSWORD = "RESET_PASSWORD",
}

interface DialogState {
  type: DialogTypeEnum | null;
  isOpen: boolean;
  openDialog: (type: DialogTypeEnum) => void;
  closeDialog: () => void;
}

export const useDialog = create<DialogState>((set) => ({
  type: null,
  isOpen: false,
  openDialog: (type) => set({ type, isOpen: true }),
  closeDialog: () => set({ type: null, isOpen: false }),
}));
