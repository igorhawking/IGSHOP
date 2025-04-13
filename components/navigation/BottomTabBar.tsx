import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, ShoppingCart, Camera, User, Menu } from "lucide-react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

type BottomTabBarProps = {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
};

export default function BottomTabBar({
  activeTab,
  onTabPress,
}: BottomTabBarProps) {
  const tabs: TabItem[] = [
    {
      key: "home",
      label: "Início",
      icon: (
        <Home
          size={24}
          color={activeTab === "home" ? colors.primary : colors.textSecondary}
        />
      ),
    },
    {
      key: "market",
      label: "Mercado",
      icon: (
        <ShoppingCart
          size={24}
          color={
            activeTab === "market" ? colors.secondary : colors.textSecondary
          }
        />
      ),
    },
    {
      key: "scan",
      label: "Scan & Go",
      icon: (
        <Camera
          size={24}
          color={activeTab === "scan" ? colors.action : colors.textSecondary}
        />
      ),
    },
    {
      key: "profile",
      label: "Perfil",
      icon: (
        <User
          size={24}
          color={
            activeTab === "profile" ? colors.primary : colors.textSecondary
          }
        />
      ),
    },
    {
      key: "more",
      label: "Mais",
      icon: (
        <Menu
          size={24}
          color={activeTab === "more" ? colors.primary : colors.textSecondary}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabButton}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          {tab.key === activeTab && (
            <View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor:
                    tab.key === "market"
                      ? colors.secondary
                      : tab.key === "scan"
                        ? colors.action
                        : colors.primary,
                },
              ]}
            />
          )}
          {tab.icon}
          <Text
            style={[
              styles.tabLabel,
              {
                color:
                  tab.key === activeTab
                    ? tab.key === "market"
                      ? colors.secondary
                      : tab.key === "scan"
                        ? colors.action
                        : colors.primary
                    : colors.textSecondary,
                fontWeight:
                  tab.key === activeTab ? fontWeight.bold : fontWeight.regular,
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 72,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.support,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    marginTop: 4,
  },
});
