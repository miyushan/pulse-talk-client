import { createStore } from "zustand/vanilla";

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

export type AppStore = AppState & AppActions;

export const defaultInitState: AppStore = {
  userId: 0,
  userName: "",
  userEmail: "",
  selectedChatRoomId: 0,
  selectedChatRoomName: "",
  selectUser: () => {},
  selectChatRoom: () => {},
  resetUser: () => {},
  resetSelectedChatRoom: () => {},
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    selectUser: (userId: number, userName: string, userEmail: string) =>
      set({ userId, userName, userEmail }),
    selectChatRoom: (chatRoomId: number, chatRoomName: string) =>
      set({
        selectedChatRoomId: chatRoomId,
        selectedChatRoomName: chatRoomName,
      }),
    resetUser: () => set({ userId: 0, userName: "", userEmail: "" }),
    resetSelectedChatRoom: () =>
      set({ selectedChatRoomId: 0, selectedChatRoomName: "" }),
  }));
};
