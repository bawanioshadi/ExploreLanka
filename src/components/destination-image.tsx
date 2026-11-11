import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ImageStyle, StyleProp } from "react-native";

import { placeImages } from "../data/place-images";

type DestinationImageProps = {
  name: string;
  category?: string;
  style?: StyleProp<ImageStyle>;
};

const fallbackColors: Record<string, string> = {
  nature: "#dceee1",
  beach: "#d9eef2",
  historical: "#eee4d7",
  wildlife: "#e5ecd5",
};

export function DestinationImage({
  name,
  category = "Nature",
  style,
}: DestinationImageProps) {
  const source = placeImages[name];
  const [hasError, setHasError] = useState(false);

  if (source && !hasError) {
    return (
      <Image
        source={source}
        style={style}
        contentFit="cover"
        transition={180}
        accessibilityLabel={`${name} destination`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { backgroundColor: fallbackColors[category.toLowerCase()] ?? "#e5ece9" },
        style,
      ]}
      accessibilityLabel={`${name} photo unavailable`}
    >
      <Text style={styles.fallbackTitle}>{name}</Text>
      <Text style={styles.fallbackCategory}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 16,
  },
  fallbackTitle: {
    color: "#23433d",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  fallbackCategory: {
    color: "#55726b",
    fontSize: 12,
    marginTop: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
