import { Text as TextRN, StyleSheet } from "react-native";
import { TextProps, PressableProps } from "react-native";
import { Pressable } from "react-native";
import { useThemeColor } from "../hooks/use-theme";

export type textVariant = "default" | "error" | "secondary" | "success" | "primary" | "outline" | "brand";

const Text = ({
  variant = "default",
  type = "regular",
  children,
  ...props
}: {
  type?: "regular" | "title";
  variant?: textVariant;
} & TextProps) => {
  const { colors } = useThemeColor();
  const { style, ...rest } = props;
  const variantStyle = {
    default: colors.foreground,
    error: colors.destructiveForeground,
    secondary: colors.mutedForeground,
    success: colors.success,
    primary: colors.primaryForeground,
    outline: colors.accentForeground,
    brand: colors.primary,
  };

  return (
    <TextRN style={[type === "regular" ? styles.regular : styles.title, { color: variantStyle[variant] }, style]} {...rest}>
      {children}
    </TextRN>
  );
};

const PressableText = ({ variant = "default", border = false, children, ...props }: { variant?: textVariant; border?: boolean } & TextProps) => {
  const { onPress, style, ...rest } = props;
  const { colors } = useThemeColor();
  const variantStyle = {
    default: colors.foreground,
    error: colors.error,
    secondary: colors.mutedForeground,
    success: colors.success,
    primary: colors.primaryForeground,
    outline: colors.accentForeground,
    brand: colors.primary,
  };

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.secondary : colors.background,
        borderBottomWidth: border ? 2 : 0,
      })}
      onPress={onPress}
      {...rest}
    >
      {({ pressed }) => (
        <TextRN style={[{ fontSize: 14, fontFamily: "GeistRegular", color: variantStyle[variant], opacity: pressed ? 10 : 100 }, style]} {...rest}>
          {children}
        </TextRN>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontFamily: "GeistRegular",
    fontWeight: "bold",
  },
  regular: {
    fontSize: 14,
    fontFamily: "GeistRegular",
  },
});

export { Text, PressableText };
