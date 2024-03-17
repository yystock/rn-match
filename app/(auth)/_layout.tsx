import { Stack } from "expo-router";
import { router } from "expo-router";

import { Icon } from "../../components/ui";
import { Button } from "../../components/ui";

export default function AuthLayout() {
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
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: true }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
