import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { Image, Text } from "react-native";
import { tabIcons } from "../../data/tab-icons";

function DestinationTabIcon({
  route,
  color,
  size,
}: {
  route: "home" | "explore" | "favorites" | "profile" | "add";
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

  const symbols = {
    favorites: "♡",
    profile: "♙",
    add: "+",
  };

  return (
    <Text
      style={{
        color,
        fontSize: route === "add" ? size + 8 : size + 3,
        lineHeight: size + 10,
        fontWeight: "600",
      }}
      accessibilityLabel={route}
    >
      {symbols[route]}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#183F35",
        tabBarInactiveTintColor: "#899792",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8E5DA",
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
          title: "Add Place",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="add" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="favorites" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <DestinationTabIcon route="profile" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
