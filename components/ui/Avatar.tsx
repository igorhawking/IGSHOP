import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  source?: string;
  size?: AvatarSize;
  name?: string;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
};

export default function Avatar({
  source,
  size = "md",
  name,
  style,
  borderColor,
}: AvatarProps) {
  const getSize = () => {
    switch (size) {
      case "xs":
        return 24;
      case "sm":
        return 32;
      case "md":
        return 48;
      case "lg":
        return 64;
      case "xl":
        return 96;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "xs":
        return fontSize.xs;
      case "sm":
        return fontSize.sm;
      case "md":
        return fontSize.md;
      case "lg":
        return fontSize.lg;
      case "xl":
        return fontSize.xl;
      default:
        return fontSize.md;
    }
  };

  const getInitials = () => {
    if (!name) return "";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const avatarSize = getSize();
  const borderWidth = size === "xs" ? 1 : 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          borderWidth: borderColor ? borderWidth : 0,
          borderColor: borderColor || "transparent",
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{
            width: avatarSize - (borderColor ? borderWidth * 2 : 0),
            height: avatarSize - (borderColor ? borderWidth * 2 : 0),
            borderRadius: avatarSize / 2,
          }}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: avatarSize - (borderColor ? borderWidth * 2 : 0),
              height: avatarSize - (borderColor ? borderWidth * 2 : 0),
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: getFontSize() }]}>
            {getInitials()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  placeholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "white",
    fontWeight: fontWeight.bold,
  },
});
