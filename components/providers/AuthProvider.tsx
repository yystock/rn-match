import React, { createContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { supabase } from "../../utils/initSupabase";
import { setItem, getItem } from "../../utils/asyncStorage";
import { router, useSegments } from "expo-router";

type ContextProps = {
  user: null | User;
  session: Session | null;
  initialized?: boolean;
  signOut?: () => void;
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<Partial<ContextProps>>({});

export function useAuth() {
  return React.useContext(AuthContext);
}

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = (props: Props) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();

  useEffect(() => {
    // check persistent storage for initialized
    const checkInitialized = async () => {
      const init = await getItem("initialized");
      setInitialized(init === "1" ? true : false);
      if (init === "0") {
        router.replace("/onboarding");
      }
    };
    const setInit = async () => {
      await setItem("initialized", "1");
      setInitialized(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkInitialized();
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      if (session && !initialized) {
        setInit();
      }
      setUser(session ? session.user : null);
      setSession(session);
    });

    return () => {
      authListener!.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function checkStatus(id: string) {
      console.log("function called");
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error) {
        console.log(error);
      }
      if (profile?.status === "pending") {
        router.replace("/(setup)/setup");
      } else {
        console.log("tabs");
        router.replace("/(tabs)");
      }
    }
    // Check if the path/url is in the (tabs) group
    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      // Redirect authenticated users to the list page
      checkStatus(session.user.id);
    } else if (!session && !initialized) {
      router.replace("/onboarding");
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      router.replace("/auth");
    }
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    if (session?.user.app_metadata.provider === "google") {
      await GoogleSignin.signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signOut,
        initialized,
        setInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
