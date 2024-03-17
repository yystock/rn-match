import React from "react";
import { StyleSheet, TouchableOpacity, Image, Switch, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Appearance } from "react-native";
import { View } from "../../components/ui/View";
import { Button, Icon, Screen } from "../../components/ui";
import { Text } from "../../components/ui/Text";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/providers/AuthProvider";
import { useThemeColor } from "../../components/hooks/use-theme";

type SectionType = {
  header: string;
  icon: string;
  items: {
    icon: React.ComponentProps<typeof Feather>["name"];
    color: string;
    label: string;
    type: string;
    value?: boolean;
  }[];
}[];

const SECTIONS: SectionType = [
  {
    header: "Preferences",
    icon: "settings",
    items: [
      { icon: "globe", color: "#fe9400", label: "Language", type: "link" },
      {
        icon: "moon",
        color: "#007afe",
        label: "Dark Mode",
        value: false,
        type: "boolean",
      },

      { icon: "navigation", color: "#32c759", label: "Location", type: "link" },
    ],
  },
  {
    header: "Help",
    icon: "help-circle",
    items: [
      { icon: "flag", color: "#8e8d91", label: "Report Bug", type: "link" },
      { icon: "mail", color: "#007afe", label: "Contact Us", type: "link" },
    ],
  },
];

export default function Settings() {
  const colorScheme = useColorScheme();
  const { colors } = useThemeColor();
  const { initialized, setInitialized, signOut } = useAuth();
  const toggleSwitch = () => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  async function clearStorage() {
    await AsyncStorage.clear();
    setInitialized && setInitialized(false);
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerTitleAlign: "center",
        }}
      />

      {SECTIONS.map(({ header, items }) => (
        <View style={styles.section} key={header}>
          <Text style={styles.sectionHeader}>{header}</Text>
          {items.map(({ label, icon, type, value, color }, index) => {
            return (
              <TouchableOpacity
                style={{ backgroundColor: colors.background }}
                key={label}
                onPress={() => {
                  // handle onPress
                }}
              >
                <View variant="outline" style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: color }]}>
                    <Feather color="#fff" name={icon} size={18} />
                  </View>

                  <Text style={styles.rowLabel}>{label}</Text>

                  <View style={styles.rowSpacer} />

                  {type === "boolean" && <Switch value={colorScheme === "light" ? true : false} onValueChange={toggleSwitch} />}

                  {type === "link" && <Icon name="chevron-forward-outline" size={22} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <View style={[styles.section, { gap: 10 }]}>
        <Button
          variant="error"
          title="Clear Data"
          onPress={() => {
            clearStorage();
            signOut && signOut();
          }}
        >
          <View style={[styles.textAndIcon]} variant="error">
            <Icon name="trash-outline" color="white" />
          </View>
        </Button>

        <Button title="Sign Out" onPress={signOut} />
      </View>
      <View style={{ flexGrow: 1, flexDirection: "column-reverse", alignItems: "flex-end" }}>
        <Text style={{ alignSelf: "center" }}>Version : 1.0</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  section: {
    paddingHorizontal: 24,
  },
  textAndIcon: {
    position: "absolute",
    left: 20,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
