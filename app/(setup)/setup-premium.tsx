import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Animated, { FadeInLeft, FadeInRight, FadeInUp, FadeOutDown, FadeOutLeft, FadeOutRight } from "react-native-reanimated";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-native-date-picker";
import { StatusBar } from "expo-status-bar";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

import { Icon, PressableText, Text } from "../../components/ui";
import { BorderlessInput, Input } from "../../components/ui/Input";
import { Button, CheckBox, ProgressBar } from "../../components/ui";
import { memberShipSchema } from "../../utils/types/UserSchema";
import { gender } from "../../constants/selection";
import { supabase } from "../../utils/initSupabase";
import { useAuth } from "../../components/providers/AuthProvider";
import { useThemeColor } from "../../components/hooks/use-theme";
import Avatar from "../../components/Avatar";
import { View } from "../../components/ui";
import { Screen } from "../../components/ui";
import LottieView from "lottie-react-native";
import { useQueryClient } from "@tanstack/react-query";

type formType = z.infer<typeof memberShipSchema>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["username", "dob", "gender"],
  },
  {
    id: "Step 2",
    name: "Prompt",
  },

  { id: "Step 3", name: "Complete" },
];

export default function SetUpPremium() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;
  const { colors } = useThemeColor();

  const {
    handleSubmit,
    control,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<formType>({
    resolver: zodResolver(memberShipSchema),
    defaultValues: {},
  });
  const onSubmit = async (values: formType) => {
    try {
      if (!session) {
        return null;
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .update({
            birthday: values.dob.toDateString(),
            username: values.username,
            gender: values.gender,
            status: "free",
            avatar_url: values.avatar_url,
            prompt: values.prompt,
            preference: values.preference,
            role: "membership",
          })
          .eq("id", session.user.id);
        queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
        if (error) {
          console.log(error);
          throw error;
        }
      }
    } catch (error: any) {
      setError("root.serverError", { type: error.code, message: error.message });
      return error;
    }
  };
  const showErrorToast = () => {
    if (Object.keys(errors).length === 0) {
      return;
    } else {
      let formattedErrors = "";

      for (let key in errors) {
        const error = errors[key as keyof FieldErrors<formType>];
        formattedErrors += `${key} Error: ${error?.message}\n`;
      }

      Toast.show({ type: "error", text1: "Error", text2: formattedErrors });
    }
  };
  type FieldName = keyof formType;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    showErrorToast();
    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        const data = await handleSubmit(onSubmit)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  useEffect(() => {
    showErrorToast();
  }, [errors]);

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <Screen variant="safe" style={{ paddingTop: 16, backgroundColor: currentStep === 1 ? "#F8E9B0" : colors.background }}>
      <StatusBar hidden />
      <ProgressBar h={13} value={((currentStep + 1) / steps.length) * 100} />
      <View style={{ flex: 1 }}>
        {currentStep === 0 && (
          <Animated.View
            style={[styles.body]}
            entering={delta >= 0 ? FadeInLeft.duration(500) : FadeInRight.duration(500)}
            exiting={delta >= 0 ? FadeOutRight.duration(500) : FadeOutLeft.duration(500)}
          >
            <View style={{ width: 400, height: 200 }}>
              <Controller
                control={control}
                name="avatar_url"
                render={({ field: { value, onChange } }) => <Avatar display url={value || ""} size={200} onUpload={(value) => onChange(value)} />}
              />
            </View>
            <View>
              <Controller
                control={control}
                name="username"
                render={({ field: { value, onChange } }) => (
                  <BorderlessInput placeholder="ENTER YOUR NAME" value={value} onChangeText={(value) => onChange(value)} />
                )}
              />
              <View style={styles.genderContainer}>
                <Text variant="secondary" style={{ fontSize: 18 }}>
                  I am a
                </Text>
                {gender.map((item) => (
                  <Controller
                    key={item.id}
                    control={control}
                    name="gender"
                    render={({ field: { value, onChange } }) => (
                      <>
                        {
                          <CheckBox
                            checked={value === item.id}
                            onChange={(checked) => {
                              return checked ? onChange(item.id) : onChange("");
                            }}
                            label={item.label}
                          />
                        }
                      </>
                    )}
                  />
                ))}
              </View>
              <View style={styles.dobContainer}>
                <Text variant="secondary" style={{ fontSize: 18 }}>
                  And My Birthday is
                </Text>
                <Controller
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <View>
                      <PressableText border style={styles.dobInput} onPress={() => setShow(true)}>
                        {value && value.toDateString()}
                      </PressableText>
                      <Animated.View
                        entering={FadeInUp}
                        exiting={FadeOutDown}
                        style={{ backgroundColor: colors.error, position: "absolute", bottom: 10 }}
                      >
                        <DatePicker
                          modal
                          mode="date"
                          open={show}
                          date={value || new Date()}
                          onConfirm={(value) => {
                            setShow(false);
                            onChange(value);
                          }}
                          onCancel={() => {
                            setShow(false);
                          }}
                        />
                      </Animated.View>
                    </View>
                  )}
                  name="dob"
                />
              </View>
            </View>
          </Animated.View>
        )}
        {currentStep === 1 && (
          <View style={{ flex: 1, backgroundColor: "#F8E9B0" }}>
            <View style={{ flex: 2, backgroundColor: "#F8E9B0" }}>
              <LottieView source={require("../../assets/animation/animation9.json")} resizeMode="contain" autoPlay />
            </View>
            <View style={{ flex: 1.2, backgroundColor: "#F8E9B0", gap: 20 }}>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    style={{ backgroundColor: "#F8E9B0" }}
                    multiline
                    value={value}
                    onChangeText={(value) => onChange(value)}
                    placeholder="About me: I am a passionate software engineer who loves hiking, indie music, and cooking.."
                  />
                )}
                name="prompt"
              />
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    style={{ backgroundColor: "#F8E9B0" }}
                    multiline
                    value={value}
                    onChangeText={(value) => onChange(value)}
                    placeholder="Preference: Seeking a kind-hearted woman who values humor and intellect."
                  />
                )}
                name="preference"
              />
            </View>
          </View>
        )}
        {currentStep === 2 && (
          <Animated.View
            entering={delta >= 0 ? FadeInLeft.duration(500) : FadeInRight.duration(500)}
            exiting={delta >= 0 ? FadeOutRight.duration(500) : FadeOutLeft.duration(500)}
            style={styles.completeContainer}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text variant="secondary">Submitting...</Text>
              </>
            ) : errors.root?.serverError ? (
              <>
                <Icon name="close-circle" size={36} variant="error" />
                <Text variant="error">{JSON.stringify(errors.root.serverError.message)}</Text>
                <Button style={{ alignSelf: "stretch" }} onPress={handleSubmit(onSubmit)} title="Retry" />
              </>
            ) : (
              <>
                <Icon name="checkmark-circle-outline" size={36} variant="success" />
                <Text variant="secondary" style={{ fontSize: 18 }}>
                  Complete
                </Text>

                <Button style={{ alignSelf: "stretch" }} onPress={() => router.replace("/(tabs)/")} title="Go to Home" />
              </>
            )}
          </Animated.View>
        )}
        <Button
          icon
          disabled={currentStep === 0}
          variant="secondary"
          style={[styles.navigator, styles.back, currentStep === 0 && styles.disabledButton]}
          onPress={() => prev()}
        >
          <Icon name="arrow-back" size={36} />
        </Button>
        <Button
          icon
          variant="primary"
          disabled={currentStep === steps.length - 1}
          style={[styles.navigator, styles.forward, currentStep === steps.length - 1 && styles.disabledButton]}
          onPress={() => next()}
        >
          <Icon name="arrow-forward" color="white" size={36} />
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 52,
    alignItems: "center",
    gap: 40,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  dobContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  dobInput: {
    fontSize: 18,

    minWidth: 80,
  },
  navigator: {
    position: "absolute",
    bottom: 15,
  },
  forward: {
    right: 10,
  },
  back: {
    left: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  completeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    gap: 20,
  },
});
