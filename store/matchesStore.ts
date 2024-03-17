import { create } from "zustand";
import { Database, Tables } from "../utils/types/database.types";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Match = Database["public"]["Functions"]["get_user_matches"]["Returns"][0];
// type Match = Tables<"match">;

export interface matchesState {
  matches: Match[];
  match: (match: Match) => void;
  AddMatches: (matches: Match[]) => void;
  removeAllMatches: () => void;
  removeMatch: (match: Match) => void;
  numberOfMatches: number;
}
const useMatchStore = create(
  persist<matchesState>(
    (set) => ({
      matches: [],
      numberOfMatches: 0,
      match: (match: Match) =>
        set((state) => ({
          numberOfMatches: state.numberOfMatches + 1,
          matches: [...state.matches.filter((p) => p.id !== match.id), match],
        })),
      AddMatches: (matches: Match[]) =>
        set((state) => ({
          numberOfMatches: matches.length,
          matches: matches,
        })),
      removeAllMatches: () => {
        set({ matches: [], numberOfMatches: 0 });
        AsyncStorage.removeItem("match-storage");
      },
      removeMatch: (match: Match) =>
        set((state) => ({
          numberOfMatches: state.numberOfMatches - 1,
          matches: state.matches.filter((p) => p.id !== match.id),
        })),
    }),
    {
      name: "match-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useMatchStore;
