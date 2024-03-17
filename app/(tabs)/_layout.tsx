import { Link, Tabs } from "expo-router";
import { Platform, Pressable, View, useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { useThemeColor } from "../../components/hooks/use-theme";
import { useAuth } from "../../components/providers/AuthProvider";
import { Icon } from "../../components/ui";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function TabLayout() {
  const { colors } = useThemeColor();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="chat/index"
        options={{
          tabBarIcon: ({ color, focused }) => <Icon tabIcon name="chatbox-outline" color={focused ? colors.primary : colors.foreground} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>{({ pressed }) => <Icon name="heart-outline" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />}</Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="love"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background,
                borderColor: focused ? colors.primary : colors.border,
                borderWidth: 2,

                width: Platform.OS == "ios" ? 50 : 60,
                height: Platform.OS == "ios" ? 50 : 60,
                top: Platform.OS == "ios" ? -10 : -20,
                borderRadius: Platform.OS == "ios" ? 25 : 30,
              }}
            >
              <Icon name="heart-outline" color={focused ? colors.primary : colors.foreground} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => <Icon name="person-outline" tabIcon color={focused ? colors.primary : colors.foreground} />,
        }}
      />
    </Tabs>
  );
}
