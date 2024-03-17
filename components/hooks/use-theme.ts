import { Text as DefaultText, useColorScheme, View as DefaultView } from "react-native";

import Colors from "../../constants/colors";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor() {
  const theme = useColorScheme() ?? "light";

  return {
    colors: { ...Colors, ...Colors[theme] },
    theme,
  };
}
