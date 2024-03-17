import { useCallback, useState } from "react";
import { z } from "zod";
import { View, Text, StyleSheet, Alert } from "react-native";

import { UserDataSchema } from "../../utils/types/UserSchema";
import { Button, ProgressBar } from "../ui";
import { Input, PwdInput } from "../ui/Input";
import { emailSchema } from "../../utils/types/UserSchema";
import { supabase } from "../../utils/initSupabase";

export default function EmailAuth() {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<String | null>(null);

  const steps = [
    {
      id: "Step 1",
      name: "Email",
      fields: ["email"],
    },
    {
      id: "Step 2",
      name: "Password",
      fields: ["password"],
    },
    { id: "Step 3", name: "Complete" },
  ];
  const FormTitles = ["Sign Up", "Personal Info", "Other"];

  const validateAndSubmitForm = useCallback(() => {
    // if (network.isOffline || account.isLoading) {
    //     return;
    // }
    try {
      const isValidEmail = emailSchema.parse(email);
      // console.log(isValidEmail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError("Please enter valid email");
      }
    }
  }, [setFormError]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  const next = async () => {
    const fields = steps[currentStep].fields;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await signInWithEmail();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <View>
      {currentStep === 0 && (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Text>Email</Text>

          <Input onChangeText={(text) => setEmail(text)} value={email} placeholder="email@address.com" />
        </View>
      )}

      {currentStep === 1 && (
        <View style={styles.verticallySpaced}>
          <Text>Password</Text>

          <PwdInput onChangeText={(text) => setPassword(text)} value={password} placeholder="Password" />
        </View>
      )}

      {currentStep === 2 && (
        <>
          <View>Complete</View>
          <View>Thank you for your submission.</View>
        </>
      )}

      <Button title="Continue"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
