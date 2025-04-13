import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return colors.support;

    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.secondary;
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;

    switch (variant) {
      case "primary":
      case "secondary":
        return colors.textLight;
      case "outline":
        return colors.primary;
      case "ghost":
        return colors.textPrimary;
      default:
        return colors.textLight;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.support;

    switch (variant) {
      case "outline":
        return colors.primary;
      default:
        return "transparent";
    }
  };

  const getHeight = () => {
    switch (size) {
      case "sm":
        return 40;
      case "md":
        return 48;
      case "lg":
        return 56;
      default:
        return 48;
    }
  };

  const getPadding = () => {
    switch (size) {
      case "sm":
        return { paddingHorizontal: 16 };
      case "md":
        return { paddingHorizontal: 24 };
      case "lg":
        return { paddingHorizontal: 32 };
      default:
        return { paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return fontSize.sm;
      case "md":
        return fontSize.md;
      case "lg":
        return fontSize.lg;
      default:
        return fontSize.md;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        { borderColor: getBorderColor() },
        { height: getHeight() },
        getPadding(),
        fullWidth && styles.fullWidth,
        variant === "outline" && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              { fontSize: getFontSize() },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "transparent",
  },
  fullWidth: {
    width: "100%",
  },
  outline: {
    borderWidth: 1,
  },
  text: {
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
