import { Stack, router } from "expo-router";
import { Button, Icon } from "../../components/ui";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: true,
        headerTitle: () => null,
      }}
    >
      <Stack.Screen name="preference" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: "Edit Profile",
          headerLeft: () => (
            <Button
              icon
              onPress={() => {
                // Navigate back to the home screen
                router.push("/(stacks)/setting");
              }}
            >
              <Icon name="arrow-back" size={24} />
            </Button>
          ),
        }}
      />
      {/* <Stack.Screen
        name="chat/[conversation]"
        options={
          {
            // headerLeft: () => (
            //   <Button
            //     icon
            //     onPress={() => {
            //       // Navigate back to the home screen
            //       router.push("/(tabs)/chat");
            //     }}
            //   >
            //     <Icon name="arrow-back" size={24} />
            //   </Button>
            // ),
          }
        }
      /> */}
      <Stack.Screen name="profile/[profile]" options={{ headerShown: false }} />
      <Stack.Screen
        name="setting"
        options={{
          headerLeft: () => (
            <Button
              icon
              onPress={() => {
                // Navigate back to the home screen
                router.push("/(tabs)");
              }}
            >
              <Icon name="arrow-back" size={24} />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
