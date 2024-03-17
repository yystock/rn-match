import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import GoogleIcon from "../../assets/icons8-google.svg";
import { supabase } from "../../utils/initSupabase";
import { Button, View } from "../ui";

WebBrowser.maybeCompleteAuthSession();
export default function GoogleSignIn() {
  const router = useRouter();

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: "690445996654-5ik5t7ie82v5ohrvs6acjblebaee97u9.apps.googleusercontent.com",
    iosClientId: "690445996654-kfjh9fc2mt62ea7764jitoffnua6973p.apps.googleusercontent.com",
  });
  if (Platform.OS === "android") {
    return (
      <Button
        title="Continue with Google"
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.idToken,
              });
            } else {
              throw new Error("no ID token present!");
            }
          } catch (error: any) {
            console.log("google signin", error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      >
        <View style={styles.textAndIcon}>
          <GoogleIcon width={20} height={20} />
        </View>
      </Button>
    );
  }
  return <>{/* Implement IOS Auth options. */}</>;
}

const styles = StyleSheet.create({
  textAndIcon: {
    position: "absolute",
    left: 20,
  },
});
