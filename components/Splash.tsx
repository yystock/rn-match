import React from "react";
import { View } from "react-native";
import Lottie from "lottie-react-native";

interface SplashProps {
  setAppReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Splash({ setAppReady }: SplashProps): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: "center", margin: 0 }}>
      <Lottie
        source={require("../assets/animation-splash.json")}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={{ margin: 0 }}
        onAnimationFinish={() => setAppReady(true)}
      />
    </View>
  );
}
