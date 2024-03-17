import { View, StyleSheet, AppState, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { PressableText, Text } from "../../components/ui/Text";
import { Button, Icon } from "../../components/ui";
import { supabase } from "../../utils/initSupabase";

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; password: string }>();
  const [loading, setLoading] = useState(false);

  const appState = useRef(AppState.currentState);

  async function signInWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // console.log("App has come to the foreground!");
        signInWithEmail();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => null,
          headerLeft: () => (
            <Button
              icon
              onPress={() => {
                // Navigate back to the home screen
                router.back();
              }}
            >
              <Icon name="arrow-back" size={24} />
            </Button>
          ),
        }}
      />
      <View style={styles.body}>
        <Ionicons name="mail-outline" size={36} color="white" style={styles.icon} />
        <Text type="title" style={{ marginVertical: 8 }}>
          Check your email
        </Text>
        <Text variant="secondary">Tap the link we sent to</Text>
        <Text variant="secondary"> {params.email} to verify your </Text>
        <Text variant="secondary">account.</Text>
        <Text variant="secondary">It may take a minute to come through.</Text>
        <Text variant="secondary">
          Didn't get a link?
          <PressableText
            onPress={async () => {
              const { data, error } = await supabase.auth.resend({
                type: "signup",
                email: params.email,
                options: {
                  emailRedirectTo: "https://example.com/welcome",
                },
              });
            }}
          >
            {" "}
            Try again
          </PressableText>
        </Text>
      </View>

      <Button title="Continue" style={{ alignSelf: "stretch", marginTop: "auto" }} onPress={signInWithEmail} disabled={loading}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    flex: 1,
  },
  body: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: "black",
    borderRadius: 100,
    padding: 20,
  },
});
