import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="place/[id]"
        options={{
          headerShown: true,
          title: "Destination Details",
          headerStyle: { backgroundColor: "#F5F7FA" },
          headerTintColor: "#087F70",
          headerTitleStyle: {
            color: "#183A34",
            fontWeight: "700",
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
