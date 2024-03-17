import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, TextInput, Dimensions } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { useUpdateProfile } from "./hooks/use-profiles";
import { useAuth } from "./providers/AuthProvider";
import { supabase } from "../utils/initSupabase";
import Avatar from "./Avatar";
import { Icon, Text, View, Button } from "./ui";
import { useThemeColor } from "./hooks/use-theme";
import { profileData } from "../constants/mock";
import { getAge } from "../utils/utils";
import { currentMatch, useDeleteMatch } from "./hooks/use-matches";
import { personality } from "../constants/selection";

export default function ProfilePage({ session, profile }: { session: Session; profile: currentMatch }) {
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [upload, setUpload] = useState(false);
  // const { data: profile, isLoading } = useProfile(session.user.id);

  const { mutate: updateProfile } = useUpdateProfile();
  const queryClient = useQueryClient();
  const { colors } = useThemeColor();

  const h = Dimensions.get("screen").height / 2;
  const w = Dimensions.get("screen").width;
  const personalities: Array<string> = profile.personalities as Array<string>;
  const hobbies: Array<string> = profile.hobbies as Array<string>;
  const { mutate: deleteMatch } = useDeleteMatch();

  const onClick = () => {
    deleteMatch({ id: profile.match_id, userId: session.user.id });
    router.push("/(tabs)/love");
  };

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
            {profile.member_id && (
              <Button
                icon
                variant="primary"
                onPress={() => router.push("/(tabs)/love")}
                style={{ position: "absolute", left: 35, top: 50, zIndex: 5 }}
              >
                <Icon name="arrow-back-outline" />
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
              <View style={[styles.center, { position: "absolute", bottom: 60, alignSelf: "center" }]}>
                <Text style={{ fontWeight: "600", fontSize: 21 }}>{profile.username}</Text>
              </View>
            </View>

            <Avatar
              display={false}
              size={200}
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
          <View style={[{ backgroundColor: colors.accent }, styles.introduction]}>
            <Text>{profile.introduction || profileData.introduction}</Text>
          </View>

          <View style={styles.basicInfoRow}>
            <View style={styles.box}>
              <Text style={{ fontSize: 15 }}>👅</Text>
              <Text style={{ fontSize: 15 }}>{profile.mbti}</Text>
            </View>
            <View style={styles.box}>
              <Text style={{ fontSize: 23 }}>{profile.gender === "male" ? "🙋🏻‍♂️" : "🙋🏻‍♀️"}</Text>
            </View>
            <View style={styles.box}>
              <Text style={{ fontSize: 15 }}>🎂</Text>
              <Text style={{ fontSize: 15 }}>{profile.age}</Text>
            </View>
          </View>

          <View style={styles.hobbiesRow}>
            <View style={[styles.bigBox, { backgroundColor: colors.muted }]}>
              <Text style={{ marginTop: 10, marginBottom: 24, fontSize: 16 }}>❤️‍🔥Hobbies</Text>
              {hobbies && hobbies.map((hobby, index) => <Text key={index}>{hobby}</Text>)}
            </View>

            <View style={[styles.bigBox, { backgroundColor: colors.muted }]}>
              <Text style={{ marginTop: 10, marginBottom: 24, fontSize: 16 }}>✨Personalities</Text>
              {personalities && personalities.map((personality, index) => <Text key={index}>{personality}</Text>)}
            </View>
          </View>

          <Button variant="error" title="Unmatch" onPress={onClick} style={{ marginBottom: 16 }} />
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
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: -35,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  basicInfoRow: {
    paddingVertical: 15,
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "space-evenly",
    gap: 20,
  },
  hobbiesRow: {
    marginTop: 18,
    flexDirection: "row",
    flex: 1,
    marginBottom: 20,
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
