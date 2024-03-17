import * as React from "react";
import {
  View as _View,
  ViewProps,
  ScrollView as _ScrollView,
  ScrollViewProps,
  KeyboardAvoidingView as _KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  StyleSheet,
} from "react-native";
import { SafeAreaView as _SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "../hooks/use-theme";

type Variant = "view" | "scroll" | "keyboardavoiding" | "safe";

export type ScreenProps = {
  variant?: Variant;
} & ViewProps &
  ScrollViewProps &
  KeyboardAvoidingViewProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function view(variant: Variant): any {
  switch (variant) {
    case "view":
      return _View;
    case "scroll":
      return _ScrollView;
    case "keyboardavoiding":
      return _KeyboardAvoidingView;
    case "safe":
      return _SafeAreaView;
  }
}
export function Screen({ style, variant = "view", ...props }: ScreenProps) {
  const { colors } = useThemeColor();
  const Component = view(variant);

  return (
    <Component
      style={[styles.screen, { backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: variant !== "safe" ?? 16 }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
