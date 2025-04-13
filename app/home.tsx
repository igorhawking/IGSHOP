import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MapPin, Bell } from "lucide-react-native";
import { colors } from "../components/theme/colors";
import { fontSize, fontWeight } from "../components/theme/typography";
import BottomTabBar from "../components/navigation/BottomTabBar";
import CategoryIcons from "../components/home/CategoryIcons";
import PromotionalCarousel from "../components/home/PromotionalCarousel";
import FavoriteStores from "../components/home/FavoriteStores";
import DailyDeals from "../components/home/DailyDeals";
import { router } from "expo-router";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    // In a real app, we would navigate to the appropriate screen
    // For now, we'll just log the tab press
    console.log(`Tab pressed: ${tabKey}`);
  };

  const handleCategoryPress = (category: string) => {
    console.log(`Category pressed: ${category}`);
    // Navigate to the appropriate category screen
    // For example, if 'delivery' is pressed, navigate to the delivery screen
    if (category === "delivery") {
      // router.push('/delivery');
    }
  };

  const handleStorePress = (storeId: string) => {
    console.log(`Store pressed: ${storeId}`);
    // Navigate to the store details screen
    // router.push(`/store/${storeId}`);
  };

  const handleDealPress = (dealId: string) => {
    console.log(`Deal pressed: ${dealId}`);
    // Navigate to the deal details screen
    // router.push(`/deal/${dealId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.locationText}>Entregar em</Text>
          <TouchableOpacity>
            <Text style={styles.addressText}>Av. Paulista, 1000</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, Usuário</Text>
          <Text style={styles.greetingSubtitle}>O que você precisa hoje?</Text>
        </View>

        <CategoryIcons onCategoryPress={handleCategoryPress} />

        <PromotionalCarousel data={[]} />

        <FavoriteStores onStorePress={handleStorePress} />

        <DailyDeals onDealPress={handleDealPress} />
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 4,
  },
  addressText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
