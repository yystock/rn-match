import { Stack } from "expo-router";
import { router } from "expo-router";

import { Icon } from "../../components/ui";
import { Button } from "../../components/ui";

export default function SetUpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        headerTitle: () => null,
        headerLeft: () => (
          <Button
            icon
            onPress={() => {
              // Navigate back to the home screen
              router.back();
            }}
          >
            <Icon name="arrow-back" size={24} />
          </Button>
        ),
      }}
    >
      <Stack.Screen name="setup" options={{ headerShown: false }} />
      <Stack.Screen name="setup-basic" options={{ headerShown: false }} />
      <Stack.Screen name="setup-premium" options={{ headerShown: false }} />
    </Stack>
  );
}
