import { StyleSheet, useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import { Button, View, Text } from "../../components/ui";
import { Screen } from "../../components/ui";
import { router } from "expo-router";
import { useAuth } from "../../components/providers/AuthProvider";
import { useProfile } from "../../components/hooks/use-profiles";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StepUpPage() {
  const { signOut, setInitialized } = useAuth();

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  // const { data: profile } = useProfile(session?.user.id);

  // useEffect(() => {
  //   if (profile && profile.status !== "pending") {
  //     router.push("/(tabs)/");
  //   }
  // }, [profile]);
  // async function clearStorage() {
  //   await AsyncStorage.clear();
  //   signOut && signOut();
  //   setInitialized && setInitialized(false);
  // }

  return (
    <Screen variant="safe">
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <LottieView source={require("../../assets/animation/diamond2.json")} resizeMode="contain" autoPlay />
      </View>
      <View style={{ alignItems: "center", gap: 18, flex: 2 }}>
        <Text variant="brand" style={{ fontSize: 21, fontWeight: "800" }}>
          Join our Membership
        </Text>

        <Text variant="secondary">✨Advanced AI features✨</Text>
      </View>
      <View style={styles.card}>
        <Button title="Skip" onPress={() => router.push("/(setup)/setup-basic")} style={{ alignSelf: "stretch" }} />
      </View>
      <View style={styles.card}>
        <Button variant="primary" title="Join Membership" onPress={() => router.push("/(setup)/setup-premium")} style={{ alignSelf: "stretch" }} />
      </View>
      {/* <Button style={{ marginTop: 20 }} title="Clear" onPress={clearStorage}></Button> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
