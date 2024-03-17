import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useThemeColor } from "../hooks/use-theme";

interface ProgressBarProps {
  value: number;
  h?: number;
}

const ProgressBar = ({ value, h = 8 }: ProgressBarProps) => {
  // const width = useSharedValue(0);
  const [cardWidth, setCardWidth] = React.useState(0);
  const { colors } = useThemeColor();

  const progressBarWidthAnimated = useAnimatedStyle(() => {
    const useClamping = value === 1 || value >= 100;
    return {
      width: withSpring((value / 100) * cardWidth, {
        overshootClamping: useClamping,
        stiffness: 75,
      }),
    };
  }, [value, cardWidth]);

  const progressBarStyles: ViewStyle[] = [styles.bar, progressBarWidthAnimated, { height: h }];

  if (value === 100) {
    progressBarStyles.push({ borderBottomRightRadius: 0 });
  }

  // onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
  return (
    <View style={[styles.container, { height: h, backgroundColor: colors.border }]} onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}>
      <Animated.View style={[progressBarStyles, { backgroundColor: colors.primary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    borderRadius: 100,
    marginTop: 0,
    padding: 0,
    overflow: "hidden",
  },
  bar: {
    width: 0,
    height: 8, // "#333",
  },
});

export { ProgressBar };
