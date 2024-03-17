import { useState } from "react";
import { Pressable, StyleSheet, Image } from "react-native";
import Animated, { Easing, ExtrapolationType, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { View, Text, Button, Icon } from "./ui";
import { currentMatch } from "./hooks/use-matches";
import { useThemeColor } from "./hooks/use-theme";
import Avatar from "./Avatar";
import { convertMetersToKilometers } from "../utils/utils";
import { router } from "expo-router";

export default function FlipCard({ data }: { data: currentMatch }) {
  const rotate = useSharedValue(0);
  const { colors } = useThemeColor();
  const frontAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [0, 180]);

    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 1000 }),
        },
      ],
    };
  });
  const backAnimatedStyles = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 1000 }),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[styles.frontcard, frontAnimatedStyles]}>
        <Pressable onPress={() => (rotate.value = rotate.value ? 0 : 1)}>
          <View variant="outline" style={[styles.card, { gap: 20 }]}>
            <View variant="outline" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>🎉 We Found You A Match 🎉</Text>
            </View>
            <Button title="Check it out 👆" style={{ padding: 20, marginTop: "auto" }} />
          </View>
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.backCard, backAnimatedStyles]}>
        <Pressable onPress={() => (rotate.value = rotate.value ? 0 : 1)}>
          <View variant="primary" style={styles.card}>
            <View variant="primary" style={{ height: 150 }}>
              <Avatar url={data.avatar_url} size={90} onUpload={(url: string) => {}} />
            </View>

            <View variant="primary" style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
              <Text variant="primary" style={{ fontSize: 21 }}>
                {data.username}
              </Text>
              <Text style={{ fontSize: 21 }}>{data.gender === "female" ? "🙋🏻‍♀️" : "🙋🏻‍♂️"}</Text>
            </View>
            <View variant="primary" style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Text variant="primary" style={{ fontSize: 21 }}>
                {data.age}
              </Text>

              <Text variant="primary">You are {convertMetersToKilometers(data.dist_meters)}km Away</Text>
            </View>
            <View variant="primary" style={{ gap: 10, marginTop: 18 }}>
              <Button variant="secondary" title="Profile Details 🔖" onPress={() => router.push(`/profile/${data.member_id}`)} />
              <Button title="Start Chatting 💬" onPress={() => router.push(`/chat/${data.match_id}`)} />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  frontcard: {
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  backCard: {
    backfaceVisibility: "hidden",
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    backgroundColor: "#8ecae6",
    marginTop: 10,
    borderRadius: 5,
  },
  card: {
    width: 250,
    minHeight: 250,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 30,
  },
});
