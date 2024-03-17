import { Platform, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../../utils/initSupabase";
import { Button, Icon, View } from "../ui";

export function AppleAuth() {
  if (Platform.OS === "ios")
    return (
      <Button
        title="Continue with Apple"
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
            });
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error("No identityToken.");
            }
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      >
        <View style={styles.textAndIcon}>
          <Icon name="logo-apple" size={20} />
        </View>
      </Button>
    );
  return <>{/* Implement Android Auth options. */}</>;
}

const styles = StyleSheet.create({
  textAndIcon: {
    position: "absolute",
    left: 20,
  },
});
