import { StyleSheet, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

import GoogleSignIn from "../../components/auth/GoogleSignIn";
import { Button, Icon, Text } from "../../components/ui";
import { AppleAuth } from "../../components/auth/AppleAuth";

const Auth = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.imageSpace]}>
        <LottieView source={require("../../assets/animation/animation8.json")} loop={false} autoPlay resizeMode="cover" />
      </View>

      <Text
        style={{
          fontSize: 50,
          fontWeight: "800",
        }}
      >
        Let's Get
      </Text>
      <Text
        style={{
          fontSize: 46,
          fontWeight: "800",
        }}
      >
        Started
      </Text>
      <View style={styles.buttonContainer}>
        <GoogleSignIn />

        <Button title="Continue with Email" onPress={() => router.push("/(auth)/sign-in")}>
          <View style={styles.textAndIcon}>
            <Icon name="person-outline" size={24} />
          </View>
        </Button>
        <AppleAuth />
      </View>
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageSpace: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  textAndIcon: {
    position: "absolute",
    left: 20,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "column-reverse",
    paddingVertical: 20,
    gap: 12,
  },
});
