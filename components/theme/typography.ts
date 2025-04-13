import { Platform } from "react-native";

// Font family configuration
export const fontFamily = {
  // Using system fonts as fallback until custom fonts are loaded
  regular: Platform.OS === "ios" ? "System" : "Roboto",
  medium: Platform.OS === "ios" ? "System" : "Roboto",
  bold: Platform.OS === "ios" ? "System" : "Roboto",
  // When custom fonts are loaded, we'll use these
  customRegular: "Inter",
  customMedium: "Inter-Medium",
  customBold: "Inter-Bold",
};

// Font sizes following 8pt grid system
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Line heights
export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
  xxxl: 40,
};

// Font weights
export const fontWeight = {
  regular: "400",
  medium: "500",
  bold: "700",
};
