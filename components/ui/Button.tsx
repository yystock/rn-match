import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { TouchableHighlightProps } from "react-native";
import { useThemeColor } from "../hooks/use-theme";
import { Text } from "./Text";

type VariantType = "primary" | "secondary" | "error" | "success" | "outline";
interface ButtonProps extends TouchableHighlightProps {
  title?: string;
  icon?: boolean;
  children?: React.ReactNode;
  variant?: VariantType;
}

const Button: React.FC<ButtonProps> = ({ title, variant = "outline", icon = false, children, ...props }) => {
  const { style, ...rest } = props;
  const { colors } = useThemeColor();
  const variantStyle = {
    primary: colors.primary,
    error: colors.error,
    secondary: colors.secondary,
    success: colors.background,
    outline: colors.background,
  };

  return (
    <>
      <TouchableHighlight
        style={[
          { backgroundColor: variant ? variantStyle[variant] : colors.background, borderColor: colors.input },
          icon ? styles.iconButton : styles.defaultButton,
          style,
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
        activeOpacity={1}
        underlayColor={colors.accent}
      >
        <View style={[styles.buttonBody, icon ? styles.onlyIcon : null]}>
          {/* button with icon */}
          {children}
          {title && <Text variant={variant}>{title}</Text>}
        </View>
      </TouchableHighlight>
    </>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    overflow: "hidden",
    paddingVertical: "3.8%",
    borderRadius: 25,
    borderWidth: 2,
  },
  iconButton: {
    borderRadius: 100,
  },
  onlyIcon: {
    padding: 9,
  },
  textAndIcon: {
    position: "absolute",
    left: 20,
  },
  buttonBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { Button };
