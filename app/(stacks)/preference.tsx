import { View, Text, Platform } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { useProfile } from "../../components/hooks/use-profiles";
import { useAuth } from "../../components/providers/AuthProvider";
import { Button, Icon, Input, Screen } from "../../components/ui";
import PreferenceForm from "../../components/PreferenceForm";
import MemberShip from "../../components/MemberShip";

export default function PreferencePage() {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);

  if (!profile) return null;
  return (
    <Screen variant="keyboardavoiding" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {profile.role === "user" ? (
        <>
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Preference",
              headerLeft: () => (
                <Button
                  icon
                  onPress={() => {
                    // Navigate back to the home screen
                    router.push("/(tabs)/love");
                  }}
                >
                  <Icon name="arrow-back" size={24} />
                </Button>
              ),
            }}
          />
          <PreferenceForm />
        </>
      ) : (
        <MemberShip />
      )}
    </Screen>
  );
}
