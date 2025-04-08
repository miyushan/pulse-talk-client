import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AppState = {
  userId: number;
  userName: string;
  userEmail: string;
  selectedChatRoomId: number;
  selectedChatRoomName: string;
};

export type AppActions = {
  selectUser: (userId: number, userName: string, userEmail: string) => void;
  selectChatRoom: (chatRoomId: number, chatRoomName: string) => void;
  resetUser: () => void;
  resetSelectedChatRoom: () => void;
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      userId: 0,
      userName: "",
      userEmail: "",
      selectedChatRoomId: 0,
      selectedChatRoomName: "",
      selectUser: (userId: number, userName: string, userEmail: string) =>
        set({ userId, userName, userEmail }),
      selectChatRoom: (chatRoomId: number, chatRoomName: string) =>
        set({
          selectedChatRoomId: chatRoomId,
          selectedChatRoomName: chatRoomName,
        }),
      resetUser: () => set({ userId: 0, userName: "", userEmail: "" }),
      resetSelectedChatRoom: () => set({ selectedChatRoomId: 0 }),
    }),
    {
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
