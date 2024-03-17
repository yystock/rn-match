import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, TextInput, Dimensions } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { Profile, useUpdateProfile } from "./hooks/use-profiles";
import { useAuth } from "./providers/AuthProvider";
import { supabase } from "../utils/initSupabase";
import Avatar from "./Avatar";
import { Icon, Text, View, Button, Input } from "./ui";
import { useThemeColor } from "./hooks/use-theme";
import { profileData } from "../constants/mock";
import { getAge } from "../utils/utils";
import { currentMatch } from "./hooks/use-matches";

export default function Account({ session, profile }: { session: Session; profile?: Profile }) {
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [upload, setUpload] = useState(false);
  // const { data: profile, isLoading } = useProfile(session.user.id);
  const { mutate: updateProfile } = useUpdateProfile();
  const { colors } = useThemeColor();

  const h = Dimensions.get("screen").height / 2;
  const w = Dimensions.get("screen").width;

  useEffect(() => {
    if (profile) {
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile]);

  return (
    <View>
      {profile && (
        <>
          <View>
            <Button
              icon
              variant="primary"
              onPress={() => router.push("/(stacks)/setting")}
              style={{ position: "absolute", right: 35, top: 50, zIndex: 5 }}
            >
              <Icon name="settings-outline" />
            </Button>
            {profile.id && (
              <Button
                icon
                variant="primary"
                onPress={() => router.push("/(stacks)/edit-profile")}
                style={{ position: "absolute", left: 35, top: 50, zIndex: 5 }}
              >
                <Icon name="create-outline" />
              </Button>
            )}

            <View style={{ height: h }}>
              <Svg
                height={h}
                width={w}
                viewBox={`0 0 ${w} ${h}`}
                style={{
                  position: "absolute",
                }}
              >
                <Path
                  fill={colors.primary}
                  d="M0 229L37.5 231.2C75 233.3 150 237.7 225 263.5C300 289.3 375 336.7 450 339.8C525 343 600 302 675 282.7C750 263.3 825 265.7 862.5 266.8L900 268L900 0L862.5 0C825 0 750 0 675 0C600 0 525 0 450 0C375 0 300 0 225 0C150 0 75 0 37.5 0L0 0Z"
                />
              </Svg>
              <View style={[styles.center, { position: "absolute", bottom: 56, alignSelf: "center" }]}>
                <Text style={{ fontWeight: "600", fontSize: 24 }}>{profile.username}</Text>
              </View>
            </View>

            <Avatar
              display
              size={190}
              url={profile.avatar_url}
              onUpload={(url: string) => {
                setAvatarUrl(url);
                updateProfile({ id: session?.user.id, avatar_url: url, updated_at: new Date().toISOString() });
              }}
            />

            {/* {mode === "edit" && (
              <View style={{ position: "absolute", backgroundColor: "black", flexDirection: "row", flex: 1, justifyContent: "center" }}>
                <Button title="Cancel" variant="error" style={{ alignSelf: "stretch", minWidth: 30 }}>
                  <Icon name="backspace-outline" color="white" />
                </Button>
                <Button title="Confirm" variant="success">
                  <Icon name="checkmark-circle-outline" variant="success" />
                </Button>
              </View>
            )} */}
          </View>
          <View style={[{ backgroundColor: colors.background }, styles.introduction]}>
            <Text variant="secondary" textBreakStrategy="balanced">
              {profile.introduction || profileData.introduction}
            </Text>
          </View>

          <View style={styles.basicInfoRow}>
            {profile.role === "user" && (
              <View style={styles.box}>
                <Text variant="secondary" style={{ fontSize: 19 }}>
                  👅 {profile.mbti}
                </Text>
              </View>
            )}
            <View style={styles.box}>
              <Text variant="secondary" style={{ fontSize: 20 }}>
                {profile.gender === "male" ? "🙋🏻‍♂️" : "🙋🏻‍♀️"}
              </Text>
            </View>
            <View style={styles.box}>
              <Text variant="secondary" style={{ fontSize: 19, textAlign: "center" }}>
                🎂 {getAge(profile.birthday)}
              </Text>
            </View>
          </View>
          {profile.role === "user" && (
            <View style={styles.hobbiesRow}>
              <View style={[styles.bigBox, { backgroundColor: colors.muted }]}>
                <Text variant="secondary" style={{ marginTop: 10, marginBottom: 24, fontSize: 16 }}>
                  ❤️‍🔥Hobbies
                </Text>
                {profile.hobbies &&
                  profile.hobbies.map((hobby, index) => (
                    <Text variant="secondary" style={{ marginVertical: 1.5 }} key={index}>
                      {hobby}
                    </Text>
                  ))}
              </View>

              <View style={[styles.bigBox, { backgroundColor: colors.muted }]}>
                <Text variant="secondary" style={{ marginTop: 10, marginBottom: 24, fontSize: 16 }}>
                  ✨Personalities
                </Text>
                {profile.personalities &&
                  profile.personalities.map((personality, index) => (
                    <Text variant="secondary" style={{ marginVertical: 1.5 }} key={index}>
                      {personality}
                    </Text>
                  ))}
              </View>
            </View>
          )}
          <View style={{ height: 300, padding: 25 }}>
            <Button title="Add More Information" style={{ padding: 0, marginTop: 30 }}>
              <Icon name="add-circle-outline" />
            </Button>
          </View>
          {/* 
          <View>
            <View style={styles.additionalInfo}>
              <View style={styles.row}>
                <Text style={{ fontSize: 16 }}>Addtional Info:</Text>
              </View>
              <View style={styles.row}>
                <Text>{profile.education}</Text>
              </View>
              <View style={styles.row}>
                <Text>{profile.religion}</Text>
              </View>
              <View style={styles.row}>
                <Text>{profile.work}</Text>
              </View>
              <View style={styles.row}>
                <Text>{profile.zodiac}</Text>
              </View>
            </View>
          </View> */}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  top: {},
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  introduction: {
    marginHorizontal: 35,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: -40,
    alignItems: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  basicInfoRow: {
    paddingVertical: 16,
    flexDirection: "row",
    // flex: 1,
    paddingHorizontal: 10,
    justifyContent: "space-evenly",
    gap: 20,
  },
  hobbiesRow: {
    marginTop: 22,
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    gap: 20,
  },

  box: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,

    minWidth: 60,
  },
  bigBox: {
    paddingHorizontal: 16,
    alignItems: "center",

    rowGap: 4,
    borderRadius: 20,
    paddingVertical: 6,
    minHeight: 200,
    minWidth: 150,
  },
  additionalInfo: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 25,
    borderRadius: 8,
    marginBottom: 8,
  },
});
