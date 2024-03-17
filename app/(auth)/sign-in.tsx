import { useEffect, useState } from "react";
import { z } from "zod";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "../../components/ui";
import { Input, PwdInput } from "../../components/ui";
import { emailSchema } from "../../utils/types/UserSchema";
import { supabase } from "../../utils/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, PressableText, Screen } from "../../components/ui";
import { authError, authErrorType, passwordCheck } from "../../utils/error";

export default function EmailAuth() {
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up" | "default">("default");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<authErrorType | null>(null);
  const [pwdCheck, setPwdCheck] = useState<passwordCheck | null>(null);

  // const offset = useSharedValue(-100);

  // const animatedStyles = useAnimatedStyle(() => ({
  //   transform: [{ translateY: offset.value }],
  // }));

  async function signInWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password1,
    });
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push({ pathname: `/(auth)/sign-up`, params: { email: email, password: password1 } });
    }
  }

  async function validateAndSubmitForm() {
    setError(null);
    // if (network.isOffline || account.isLoading) {
    //     return;
    // }
    if (authMode === "default") {
      try {
        const isValidEmail = emailSchema.parse(email);

        const { data, error } = await supabase.from("profiles").select("email").eq("email", email);
        if (data && data.length == 0) {
          setAuthMode("sign_up");
        } else if (data && data.length > 0) {
          setAuthMode("sign_in");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
          setError(authError.invalidEmail);
        }
      }
    } else if (authMode === "sign_in") {
      signInWithEmail();
    } else if (authMode === "sign_up") {
      if (!pwdCheck || !pwdCheck.length || !pwdCheck.letter || !pwdCheck.number || !pwdCheck.equal) {
        setError(authError.invalidPassword);
        return;
      } else {
        signUpWithEmail();
      }
    }
  }

  function validatePassword() {
    let length = false,
      letter = false,
      number = false,
      equal = false;

    if (!pwdCheck) {
      setPwdCheck({ length: false, letter: false, number: false, equal: false });
    }
    if (pwdCheck && password1.length >= 8 && password1.length <= 16) {
      length = true;
    }
    if (pwdCheck && /\d/.test(password1)) {
      number = true;
    }
    if (pwdCheck && /[a-zA-Z]/.test(password1)) {
      letter = true;
    }
    if (pwdCheck && password1 && password1 === password2) {
      equal = true;
    }
    setPwdCheck({ length: length, letter: letter, number: number, equal: equal });
  }

  useEffect(() => {
    validatePassword();
  }, [password1, password2]);

  return (
    <Screen>
      <Stack.Screen options={{ title: "" }} />
      <View style={[{ flex: 1 }, styles.container]}>
        {authMode === "default" && <Text type="title">Login / Sign Up with Email</Text>}
        {authMode === "sign_in" && <Text type="title">Sign In</Text>}
        {authMode === "sign_up" && <Text type="title">Sign Up</Text>}
        <View style={[styles.verticallySpaced]}>
          <Input
            onChangeText={(text) => {
              setEmail(text);
              if (authMode !== "default") {
                setAuthMode("default");
                setPassword("");
                setPassword1("");
                setPassword2("");
              }
            }}
            value={email}
            placeholder="email@address.com"
            style={{ marginTop: 16 }}
          />

          {error === authError.invalidEmail && <Text variant="error">Invalid Email</Text>}
        </View>

        {authMode === "sign_in" && (
          <Animated.View style={styles.verticallySpaced} entering={FadeInUp.duration(800)}>
            <Text>Password</Text>
            <PwdInput autoFocus={true} onChangeText={(text) => setPassword(text)} value={password} placeholder="Password" />
            <View style={{ flexDirection: "row" }}>
              {error === authError.incorrectPassword && <Text>Incorrect Password</Text>}
              <PressableText
                variant="secondary"
                style={{ marginLeft: "auto" }}
                onPress={async () => {
                  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
                  if (error) {
                    Alert.alert(error.message);
                  } else {
                    Alert.alert("Password reset email sent");
                  }
                }}
              >
                Forgot Password?
              </PressableText>
            </View>
          </Animated.View>
        )}

        {authMode === "sign_up" && (
          <Animated.View style={[styles.verticallySpaced, { marginTop: 32 }]} entering={FadeInUp.duration(800)}>
            <Text>New Password</Text>
            <PwdInput
              autoFocus={true}
              onChangeText={(text) => {
                setPassword1(text);
              }}
              value={password1}
              placeholder="Password"
            />
            <View style={styles.pwdCheck}>
              <Text variant={pwdCheck && pwdCheck.length ? "success" : "secondary"}>8 - 16 characters</Text>
              <Text variant={pwdCheck && pwdCheck.letter ? "success" : "secondary"}>1 or more letters</Text>
              <Text variant={pwdCheck && pwdCheck.number ? "success" : "secondary"}>1 or more numbers</Text>
              <Text variant={pwdCheck && pwdCheck.equal ? "success" : "secondary"}>Match Password</Text>
            </View>
            <Text>Confirm Password</Text>
            <PwdInput
              focus={false}
              onChangeText={(text) => {
                setPassword2(text);
              }}
              value={password2}
              placeholder="Password"
            />
            {error === authError.invalidPassword && <Text variant="error">Invalid Password</Text>}
          </Animated.View>
        )}
        <View style={{ flexGrow: 1 }}></View>
        {/* <Button title="Login" onPress={() => signInWithEmail()}></Button> */}

        <Button title="Continue" onPress={validateAndSubmitForm} disabled={loading}></Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  verticallySpaced: {
    marginTop: 8,
    gap: 6,
    paddingTop: 2,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  pwdCheck: {
    paddingBottom: 2,
    marginVertical: 0,
    gap: 4,
    marginLeft: 10,
  },
  mt20: {
    marginTop: 20,
  },
});
