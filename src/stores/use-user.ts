import type { User } from "@/types";
import { create } from "zustand";

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
