import * as Location from "expo-location";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../utils/initSupabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface matchesState {
  location: Location.LocationObject | null;
  getLocation: (session?: Session | null) => void;
}

const useLocationStore = create(
  persist<matchesState>(
    (set) => ({
      location: null,
      getLocation: async (session?: Session | null) => {
        if (!session) return;

        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          // setErrorMsg("Permission to access location was denied");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        console.log("location", currentLocation);
        if (session) {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .update({
                location: `POINT(${currentLocation.coords.longitude} ${currentLocation.coords.latitude})`,
              })
              .eq("id", session.user.id);

            if (error) {
              throw error;
            }
            set({ location: currentLocation });
          } catch (error) {
            if (error instanceof Error) {
              // Alert.alert(error.message);
            }
          }
        }
      },
    }),
    {
      name: "match-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useLocationStore;
