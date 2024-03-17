import { Pressable, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Redirect, router, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { ZoomInRotate } from "react-native-reanimated";
import { z } from "zod";

import { Text } from "../../components/ui/Text";
import { View } from "../../components/ui/View";
import { useAuth } from "../../components/providers/AuthProvider";
import { PressableText } from "../../components/ui/Text";
import { Database } from "../../utils/types/database.types";
import useMatchStore from "../../store/matchesStore";
import Push from "../../components/Push";
import { useProfile, useUpdateProfile } from "../../components/hooks/use-profiles";
import { useQueryClient } from "@tanstack/react-query";
import { useFindMatch, useGetCurrentMatch, useMatch } from "../../components/hooks/use-matches";
import useLocationStore from "../../store/locationStore";
import FlipCard from "../../components/FlipCard";
import { Button, Icon, Screen } from "../../components/ui";

export default function TabLoveScreen() {
  const { session } = useAuth();
  const animationRef = useRef<LottieView>(null);
  const interval = useRef<NodeJS.Timeout>();
  const match = useMatchStore((state) => state.match);
  const location = useLocationStore((state) => state.location);
  const getLocation = useLocationStore((state) => state.getLocation);
  const { data: myProfile, refetch: refetchProfile } = useProfile(session?.user.id!);
  const { mutate: updateProfile } = useUpdateProfile();
  const { data: findMatch, refetch: keepFindMatch } = useFindMatch(session?.user.id);
  const { data: currentMatch, refetch: refetchMatch } = useGetCurrentMatch();
  const { data: matches, isFetching, isRefetching, isLoading, refetch: refetchList } = useMatch(session?.user.id);
  // const queryClient = useQueryClient();
  useEffect(() => {
    if (!location && session) {
      console.log(location);
      getLocation(session);
    }
    if (currentMatch) {
    }
  }, [location, session, currentMatch]);

  useEffect(() => {
    if (myProfile?.status === "matching") {
      animationRef.current?.play();
      interval.current = setInterval(() => {
        refetchMatch();
        refetchProfile();
      }, 10000);
    } else if (myProfile?.status === "free" || myProfile?.status === "matched") {
      animationRef.current?.reset();
      clearInterval(interval.current);
      if (myProfile?.status === "matched") {
        refetchList();
      }
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [myProfile]);

  const beginSearch = async () => {
    if (!location) {
      Toast.show({ type: "error", text1: "Error", text2: "Location not found" });
      return;
    }
    if (!myProfile) {
      Toast.show({ type: "error", text1: "Error", text2: "Profile not found" });
      return;
    }
    if (myProfile.status === "free") {
      try {
        updateProfile({ id: session?.user.id, status: "matching", last_matching: new Date().toISOString() });
        keepFindMatch({});
        refetchMatch();
      } catch (error: any) {
        console.log("error!", error);
      }
    } else if (myProfile.status === "matching") {
      try {
        updateProfile({ id: session?.user.id, status: "free", last_matching: null });
      } catch (error: any) {
        console.log("error!", error);
        setTimeout(() => {
          Toast.show({ type: "error", text1: "Error", text2: "Server Error" });
        }, 1000);
      }
    } else if (myProfile.status === "matched") {
      return null;
    }
  };

  if (location) {
    return (
      <Screen variant="safe" style={styles.container}>
        <View
          style={{
            position: "absolute",
            zIndex: 50,
            right: 30,
            top: 52,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            icon
            onPress={() => {
              router.push("/(stacks)/preference");
            }}
          >
            <Icon name="options-outline" size={26} />
          </Button>
        </View>

        {myProfile &&
          (myProfile.status === "matched" && currentMatch ? (
            <Animated.View entering={ZoomInRotate.springify().damping(8).mass(3).stiffness(3).restDisplacementThreshold(0.1).restSpeedThreshold(0.1)}>
              <FlipCard data={currentMatch} />
            </Animated.View>
          ) : (
            <Pressable onPress={beginSearch} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <LottieView ref={animationRef} source={require("../../assets/heart-1.json")} loop={true} resizeMode="cover" style={{ width: "90%" }} />

              {myProfile.status === "free" ? (
                <PressableText style={{ marginTop: -20, fontSize: 18, fontWeight: "500" }}>Tap to find match</PressableText>
              ) : (
                <PressableText style={{ marginTop: -20, fontSize: 18, fontWeight: "500" }}>Tap to cancel</PressableText>
              )}
            </Pressable>
          ))}
      </Screen>
    );
  } else {
    return <LocationNotFound />;
  }
}

const LocationNotFound = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Location not found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    backgroundColor: "#000000",
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
