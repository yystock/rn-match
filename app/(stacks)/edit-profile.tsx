import { View, Text } from "../../components/ui";
import React, { useEffect } from "react";
import { useProfile } from "../../components/hooks/use-profiles";
import { useAuth } from "../../components/providers/AuthProvider";
import { BorderlessInput, Button, Input, Screen } from "../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../utils/types/UserSchema";
import { z } from "zod";
import { mbti } from "../../constants/selection";
import { supabase } from "../../utils/initSupabase";
type formType = z.infer<typeof formSchema>;

export default function EditProfilePage() {
  const { session } = useAuth();
  const { data: profile } = useProfile(session?.user.id);
  const {
    handleSubmit,
    control,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || "",
      introduction: profile?.introduction || "Too lazy to write anything..",
      gender: profile?.gender || "",
      hobbies: [],
      personalities: [],
      mbti: mbti[0],
    },
  });

  useEffect(() => {}, [profile]);

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
            mbti: values.mbti,
            hobbies: values.hobbies,
          })
          .eq("id", session.user.id);
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

  return (
    <Screen variant="safe">
      <View style={{ gap: 5 }}>
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => <Input label="Username" value={value} onChangeText={(value) => onChange(value)} />}
        />
        <Controller
          control={control}
          name="introduction"
          render={({ field: { value, onChange } }) => (
            <Input label="Introduction" value={value || "Too lazy to write anything.."} onChangeText={(value) => onChange(value)} />
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { value, onChange } }) => <Input label="Gender" value={value} onChangeText={(value) => onChange(value)} />}
        />
        <Controller
          control={control}
          name="dob"
          render={({ field: { value, onChange } }) => <Input label="Introduction" value={"dob"} onChangeText={(value) => onChange(value)} />}
        />

        <Controller
          control={control}
          name="dob"
          render={({ field: { value, onChange } }) => <Input label="Introduction" value={"dob"} onChangeText={(value) => onChange(value)} />}
        />
      </View>
      <Button title="Save" style={{ marginTop: "auto", marginBottom: 20 }} onPress={handleSubmit(onSubmit)} />
    </Screen>
  );
}
