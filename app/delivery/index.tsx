import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Search,
  Filter,
  Star,
  Clock,
  ChevronLeft,
  MapPin,
} from "lucide-react-native";
import { colors } from "../../components/theme/colors";
import { fontSize, fontWeight } from "../../components/theme/typography";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import Card from "../../components/ui/Card";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  distance: string;
}

// Sample data for restaurants
const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burger King",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: "R$ 5,99",
    categories: ["Hambúrguer", "Fast Food"],
    distance: "2,5 km",
  },
  {
    id: "2",
    name: "Pizza Hut",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    rating: 4.3,
    deliveryTime: "30-45 min",
    deliveryFee: "R$ 6,99",
    categories: ["Pizza", "Italiana"],
    distance: "3,2 km",
  },
  {
    id: "3",
    name: "Sushi Express",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    rating: 4.7,
    deliveryTime: "40-55 min",
    deliveryFee: "R$ 8,99",
    categories: ["Japonesa", "Sushi"],
    distance: "4,1 km",
  },
  {
    id: "4",
    name: "Taco Bell",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80",
    rating: 4.1,
    deliveryTime: "25-40 min",
    deliveryFee: "R$ 7,99",
    categories: ["Mexicana", "Fast Food"],
    distance: "3,7 km",
  },
  {
    id: "5",
    name: "Salad & Co",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    rating: 4.6,
    deliveryTime: "20-30 min",
    deliveryFee: "R$ 4,99",
    categories: ["Saudável", "Saladas"],
    distance: "1,8 km",
  },
];

// Filter categories
const filterCategories = [
  "Todos",
  "Promoções",
  "Hambúrguer",
  "Pizza",
  "Japonesa",
  "Brasileira",
  "Saudável",
  "Sobremesas",
  "Bebidas",
];

export default function DeliveryScreen() {
  const [activeTab, setActiveTab] = useState("delivery");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    if (tabKey === "home") {
      router.replace("/home");
    }
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/delivery/${restaurantId}`);
  };

  const handleBackPress = () => {
    router.back();
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Filter by search query
    if (
      searchQuery &&
      !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (
      selectedFilter !== "Todos" &&
      !restaurant.categories.includes(selectedFilter)
    ) {
      return false;
    }

    return true;
  });

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <Card
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item.id)}
      animated
      elevation={3}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.restaurantImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.dotSeparator} />
          <View style={styles.timeContainer}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.timeText}>{item.deliveryTime}</Text>
          </View>
          <View style={styles.dotSeparator} />
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
        <View style={styles.categoriesContainer}>
          {item.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.deliveryFeeText}>Entrega: {item.deliveryFee}</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.locationText}>Entregar em</Text>
          <TouchableOpacity>
            <Text style={styles.addressText}>Av. Paulista, 1000</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes e pratos"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {filterCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterItem,
              selectedFilter === category && styles.filterItemActive,
            ]}
            onPress={() => setSelectedFilter(category)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === category && styles.filterTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.restaurantsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum restaurante encontrado.</Text>
          </View>
        }
      />

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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 16,
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.support,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
  },
  filtersScrollView: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.support,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  filterItemActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: "white",
    fontWeight: fontWeight.bold,
  },
  restaurantsList: {
    padding: 16,
  },
  restaurantCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    padding: 0,
  },
  restaurantImage: {
    width: "100%",
    height: 160,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  distanceText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  deliveryFeeText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
