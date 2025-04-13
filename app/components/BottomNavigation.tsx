import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Search, ShoppingBag, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation = ({ activeTab = "home" }: BottomNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route);
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case "home":
        return "#EC1C24"; // red
      case "search":
        return "#FAA61A"; // orange
      case "scan":
        return "#1AB7EA"; // blue
      case "orders":
        return "#FAA61A"; // orange
      case "profile":
        return "#0F172A"; // dark blue
      default:
        return "#9CA3AF"; // gray
    }
  };

  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <View style={styles.navigationBar}>
        <TabButton
          icon={
            <Home
              size={24}
              color={activeTab === "home" ? getTabColor("home") : "#9CA3AF"}
            />
          }
          label="Home"
          isActive={activeTab === "home"}
          onPress={() => handlePress("/")}
          color={getTabColor("home")}
        />

        <TabButton
          icon={
            <Search
              size={24}
              color={activeTab === "search" ? getTabColor("search") : "#9CA3AF"}
            />
          }
          label="Search"
          isActive={activeTab === "search"}
          onPress={() => handlePress("/search")}
          color={getTabColor("search")}
        />

        <ScanButton
          onPress={() => handlePress("/scan")}
          isActive={activeTab === "scan"}
          color={getTabColor("scan")}
        />

        <TabButton
          icon={
            <ShoppingBag
              size={24}
              color={activeTab === "orders" ? getTabColor("orders") : "#9CA3AF"}
            />
          }
          label="Orders"
          isActive={activeTab === "orders"}
          onPress={() => handlePress("/orders")}
          color={getTabColor("orders")}
        />

        <TabButton
          icon={
            <User
              size={24}
              color={
                activeTab === "profile" ? getTabColor("profile") : "#9CA3AF"
              }
            />
          }
          label="Profile"
          isActive={activeTab === "profile"}
          onPress={() => handlePress("/profile")}
          color={getTabColor("profile")}
        />
      </View>
    </BlurView>
  );
};

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
  color: string;
}

const TabButton = ({
  icon,
  label,
  isActive,
  onPress,
  color,
}: TabButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={[styles.tabLabel, isActive && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

interface ScanButtonProps {
  onPress: () => void;
  isActive: boolean;
  color: string;
}

const ScanButton = ({ onPress, isActive, color }: ScanButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.scanButton,
        { backgroundColor: isActive ? color : "#1AB7EA" },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.scanIconContainer}>
        <Search size={24} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 80,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#9CA3AF",
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1AB7EA",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  scanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomNavigation;
