import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect } from "react";
import { Redirect, router } from "expo-router";

import Account from "../../components/Account";
import { useAuth } from "../../components/providers/AuthProvider";
import { useProfile } from "../../components/hooks/use-profiles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Screen } from "../../components/ui";
import { useThemeColor } from "../../components/hooks/use-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { session, signOut } = useAuth();
  const { data, isLoading } = useProfile(session?.user.id);
  const { colors } = useThemeColor();
  async function clearStorage() {
    await AsyncStorage.clear();
    signOut && (await signOut());
  }

  useEffect(() => {
    if (data && data.status === "pending") {
      router.push("/(setup)/setup");
    }
  }, [data]);
  return (
    <ScrollView style={{ backgroundColor: colors.primary }}>
      {data && data.status !== "pending" && session ? (
        <Account session={session} profile={data} />
      ) : (
        <Button style={{ marginTop: 20 }} title="Clear" onPress={clearStorage}></Button>
      )}
    </ScrollView>
  );
};

export default Home;
