import { Tabs } from "expo-router";
import { Image, Text } from "react-native";
import type { ColorValue } from "react-native";
import { tabIcons } from "../../data/tab-icons";

function DestinationTabIcon({
  route,
  color,
  size,
}: {
  route: "home" | "explore" | "add" | "favorites";
  color: ColorValue;
  size: number;
}) {
  if (route === "home" || route === "explore") {
    const source = tabIcons[route];

    return (
      <Image
        source={source}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
        accessibilityLabel={route}
      />
    );
  }

  return (
    <Text
      style={{ color, fontSize: size + 2, lineHeight: size + 4, fontWeight: "600" }}
      accessibilityLabel={route}
    >
      {route === "add" ? "+" : "\u2661"}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#087F70",
        tabBarInactiveTintColor: "#899792",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5ECE9",
          paddingTop: 7,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="explore" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="add" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="favorites" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
