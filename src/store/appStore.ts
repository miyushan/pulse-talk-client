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

export const useAppStore = create(
  persist<AppState & AppActions>(
    (set) => ({
      userId: 0,
      userName: "",
      userEmail: "",
      selectedChatRoomId: 0,
      selectedChatRoomName: "",
      selectUser: () => {},
      selectChatRoom: () => {},
      resetUser: () => {},
      resetSelectedChatRoom: () => {},
    }),
    {
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
