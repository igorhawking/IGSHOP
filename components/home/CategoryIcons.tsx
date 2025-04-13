import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Pizza, ShoppingBag, ScanLine, Briefcase } from "lucide-react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type CategoryItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
};

type CategoryIconsProps = {
  onCategoryPress: (category: string) => void;
};

export default function CategoryIcons({ onCategoryPress }: CategoryIconsProps) {
  const categories: CategoryItem[] = [
    {
      key: "delivery",
      label: "Delivery",
      icon: <Pizza size={24} color="white" />,
      color: colors.primary,
      backgroundColor: colors.primary,
    },
    {
      key: "market",
      label: "Mercado",
      icon: <ShoppingBag size={24} color="white" />,
      color: colors.secondary,
      backgroundColor: colors.secondary,
    },
    {
      key: "scan",
      label: "Scan & Go",
      icon: <ScanLine size={24} color="white" />,
      color: colors.action,
      backgroundColor: colors.action,
    },
    {
      key: "services",
      label: "Serviços",
      icon: <Briefcase size={24} color="white" />,
      color: colors.backgroundDark,
      backgroundColor: colors.backgroundDark,
    },
  ];

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={styles.categoryItem}
          onPress={() => onCategoryPress(category.key)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: category.backgroundColor },
            ]}
          >
            {category.icon}
          </View>
          <Text style={styles.label}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  categoryItem: {
    alignItems: "center",
    width: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
