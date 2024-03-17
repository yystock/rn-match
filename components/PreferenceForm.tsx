import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View, Text, Button, CheckBox } from "./ui";
import { z } from "zod";
import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";
import { preferenceSchema } from "../utils/types/preferenceSchema";
import { useThemeColor } from "./hooks/use-theme";
import { gender } from "../constants/selection";
import { useEffect } from "react";
import { useProfile, useUpdateProfile } from "./hooks/use-profiles";
import { useAuth } from "./providers/AuthProvider";
import { Stack, router } from "expo-router";

type formType = z.infer<typeof preferenceSchema>;

export default function PreferenceForm() {
  const { colors } = useThemeColor();
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const { mutate: updateProfile } = useUpdateProfile();
  const {
    handleSubmit,
    control,
    setError,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<formType>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      distance: 50,
      age: 18,
    },
  });

  const genderValue = watch("gender");

  useEffect(() => {
    if (profile?.gender) {
      setValue("gender", profile?.gender === "male" ? "female" : "male");
    }
  }, [profile]);

  const onSubmit = async (values: formType) => {
    try {
      if (!session) {
        return null;
      } else {
        updateProfile({
          id: session.user.id,
          preference: `age: ${values.age}, distance: ${values.distance}, gender: ${values.gender}`,
        });
        router.push("/(tabs)/love");
      }
    } catch (error: any) {
      setError("root.serverError", { type: error.code, message: error.message });
      return error;
    }
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 18 }}>
      <View style={{ marginVertical: 5 }}>
        <Text style={styles.label}>Distance: </Text>
        <Controller
          name="distance"
          control={control}
          render={({ field: { value, onChange } }) => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Slider
                style={{ width: 250, height: 60 }}
                minimumValue={0}
                maximumValue={500}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.muted}
                value={Math.round(value)}
                onValueChange={(value) => onChange(value)}
              />
              <Text variant="secondary" style={{ marginLeft: "auto" }}>
                {Math.round(value)}km
              </Text>
            </View>
          )}
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.label}>Age: </Text>
        <Controller
          name="age"
          control={control}
          render={({ field: { value, onChange } }) => (
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 5 }}>
              <Slider
                style={{ width: 250, height: 60 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.muted}
                value={Math.round(value)}
                onValueChange={(value) => onChange(value)}
              />
              <Text variant="secondary" style={{ marginLeft: "auto" }}>
                {Math.round(value)}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.genderContainer}>
        <Text variant="secondary" style={{ fontSize: 18 }}>
          I want to find
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

      <Button variant="primary" title="Done" onPress={handleSubmit(onSubmit)} style={{ marginBottom: 16, marginTop: "auto" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    marginBottom: 8,
  },
  raceContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
