import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button } from "./ui";
import { Input } from "./ui";
import LottieView from "lottie-react-native";
import { memberShipPreferenceSchema } from "../utils/types/preferenceSchema";
import { z } from "zod";
import { useAuth } from "./providers/AuthProvider";
import { useProfile, useUpdateProfile } from "./hooks/use-profiles";
import { router } from "expo-router";
import { useEffect } from "react";

type formType = z.infer<typeof memberShipPreferenceSchema>;

export default function MemberShip() {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const { mutate: updateProfile } = useUpdateProfile();
  const {
    handleSubmit,
    control,
    setValue,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<formType>({
    resolver: zodResolver(memberShipPreferenceSchema),
    defaultValues: {
      preference: profile?.preference || "",
    },
  });

  useEffect(() => {
    if (profile?.preference) {
      setValue("preference", profile?.preference);
    }
  }, [profile]);

  const onSubmit = async (values: formType) => {
    try {
      if (!session) {
        return null;
      } else {
        updateProfile({ id: session.user.id, preference: values.preference });
        router.push("/(tabs)/love");
      }
    } catch (error: any) {
      setError("root.serverError", { type: error.code, message: error.message });
      return error;
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2 }}>
        <LottieView source={require("../assets/animation/animation9.json")} resizeMode="contain" autoPlay />
      </View>
      <Text variant="brand" style={{ textAlign: "center", marginBottom: 100, fontSize: 28, fontWeight: "800", marginTop: -50 }}>
        Perfect Match
      </Text>
      <View style={{ flex: 1, gap: 20 }}>
        <Controller
          name="preference"
          control={control}
          render={({ field: { value, onChange } }) => <Input multiline value={value} onChangeText={(value) => onChange(value)} />}
        />
      </View>
      <Button variant="primary" title="Done" onPress={handleSubmit(onSubmit)} style={{ marginBottom: 16 }} />
    </View>
  );
}
