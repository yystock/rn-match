import React from "react";
import { Pressable, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Colors from "../../constants/colors";

import { useThemeColor } from "../hooks/use-theme";

type variantType = "default" | "error" | "secondary" | "success" | "outline";
interface IconProps {
  tabIcon?: boolean;
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: React.ComponentProps<typeof Ionicons>["style"];
  variant?: variantType;
}

export function Icon({ tabIcon = false, name, size, color, onPress, variant, style, ...props }: IconProps) {
  const { colors } = useThemeColor();
  const variantStyle = {
    default: colors.foreground,
    error: colors.error,
    secondary: colors.mutedForeground,
    success: colors.success,
    outline: colors.primary,
  };

  return (
    <Ionicons
      onPress={onPress}
      size={size ?? 28}
      style={tabIcon ? { marginBottom: -3 } : style}
      color={variant ? variantStyle[variant] : color ? color : colors.foreground}
      name={name}
      {...props}
    />
  );
}
