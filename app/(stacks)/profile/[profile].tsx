import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

import Profile from "../../../components/Profile";
import { useAuth } from "../../../components/providers/AuthProvider";
import { useProfile } from "../../../components/hooks/use-profiles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "../../../components/hooks/use-theme";
import { useGetCurrentMatch } from "../../../components/hooks/use-matches";

const ProfilePage = () => {
  const { session } = useAuth();
  const { conversation } = useLocalSearchParams();
  const { data: currentMatch, isLoading } = useGetCurrentMatch();
  const { colors } = useThemeColor();

  return (
    <ScrollView style={{ backgroundColor: colors.primary }}>
      {session && currentMatch && <Profile session={session} profile={currentMatch} />}
    </ScrollView>
  );
};

export default ProfilePage;
