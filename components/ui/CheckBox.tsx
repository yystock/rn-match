import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useThemeColor } from "../hooks/use-theme";

interface CheckboxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function CheckBox({ checked = false, onChange, label }: CheckboxProps) {
  const { colors } = useThemeColor();

  const styles = StyleSheet.create({
    checkboxBase: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 6,
      borderWidth: 2,
    },
    checkboxChecked: {
      backgroundColor: colors.muted,
      borderColor: colors.primary,
    },
    checkboxUnchecked: {
      borderColor: colors.border,
    },
  });
  return (
    <Pressable style={[styles.checkboxBase, checked ? styles.checkboxChecked : styles.checkboxUnchecked]} onPress={() => onChange(!checked)}>
      {label && <Text>{label}</Text>}
    </Pressable>
  );
}
