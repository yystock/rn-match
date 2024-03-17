import { ViewProps, View as DefaultView } from "react-native";
import { useThemeColor } from "../hooks/use-theme";
type viewVariant = "default" | "error" | "secondary" | "success" | "primary" | "outline" | "muted";
export function View({ variant = "default", ...props }: { variant?: viewVariant } & ViewProps) {
  const { style, ...otherProps } = props;
  const { colors } = useThemeColor();
  const variantStyle = {
    default: colors.background,
    error: colors.error,
    secondary: colors.secondary,
    success: colors.success,
    primary: colors.primary,
    outline: colors.accent,
    muted: colors.muted,
  };

  return (
    <DefaultView
      style={[{ backgroundColor: variant ? variantStyle[variant] : colors.background, borderColor: colors.border }, style]}
      {...otherProps}
    />
  );
}
