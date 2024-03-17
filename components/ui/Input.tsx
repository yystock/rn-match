import { StyleSheet, TextInput, TouchableOpacity, ViewStyle } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useThemeColor } from "../hooks/use-theme";
import { View } from "./View";
import { Text } from "./Text";

export type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText(e: any): void;
  maxLength?: number;
  style?: ViewStyle;
  multiline?: boolean;
  autoFocus?: boolean;
  focus?: boolean;
  defaultValue?: string;
};

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useThemeColor();
  return (
    <View {...props} style={[{ flexDirection: "row", gap: 4, alignItems: "center" }, props.style]}>
      {props.label && <Text style={{ width: 80 }}>{props.label}</Text>}
      <TextInput
        returnKeyType="done"
        placeholder={props.placeholder}
        placeholderTextColor="gainsboro"
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        defaultValue={props.defaultValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={props.value}
        style={[
          styles.input,
          {
            fontFamily: "GeistRegular",
            backgroundColor: colors.background,
            color: isFocused ? colors.foreground : colors.mutedForeground,
            borderColor: isFocused ? colors.primary : colors.border,
          },
        ]}
      />
    </View>
  );
};

const BorderlessInput = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useThemeColor();
  return (
    <View {...props} style={props.style}>
      <TextInput
        autoFocus={props.autoFocus}
        returnKeyType="done"
        multiline={props.multiline}
        placeholder={props.placeholder}
        placeholderTextColor={colors.mutedForeground}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={props.onChangeText}
        value={props.value}
        style={[
          styles.BorderlessInput,
          {
            backgroundColor: colors.background,
            borderColor: isFocused ? colors.primary : colors.border,
            color: isFocused ? colors.foreground : colors.mutedForeground,
          },
        ]}
      />
    </View>
  );
};

const PwdInput = ({ placeholder, onChangeText, value, autoFocus, focus = true }: InputProps) => {
  const [isFocused, setIsFocused] = useState(focus);
  const [visible, setVisible] = useState<boolean>(false);
  const { colors } = useThemeColor();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          alignSelf: "center",
          borderWidth: 2,
          justifyContent: "space-between",
          borderRadius: 8,
          borderColor: isFocused ? colors.primary : colors.border,
        }}
      >
        <TextInput
          autoFocus={autoFocus}
          returnKeyType="done"
          placeholder={placeholder}
          placeholderTextColor={"gainsboro"}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          secureTextEntry={visible ? false : true}
          style={[
            styles.input,
            {
              borderWidth: 0,
              width: "85%",
            },
          ]}
        />

        <TouchableOpacity
          style={{
            marginHorizontal: 5,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => {
            setVisible((prev) => !prev);
          }}
        >
          <Ionicons name={visible ? "eye-off" : "eye"} color={"#000"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { Input, PwdInput, BorderlessInput };

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
    borderWidth: 1.7,
    borderRadius: 12,
  },
  BorderlessInput: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomWidth: 2,
    textAlign: "center",
    fontSize: 15,
    width: "100%",
    alignSelf: "center",
    fontFamily: "GeistRegular",
  },
});
