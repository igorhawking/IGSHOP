import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type Store = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  category: string;
};

type FavoriteStoresProps = {
  stores?: Store[];
  onStorePress: (storeId: string) => void;
};

export default function FavoriteStores({
  stores,
  onStorePress,
}: FavoriteStoresProps) {
  // Default stores if none provided
  const defaultStores: Store[] = [
    {
      id: "1",
      name: "Restaurante Italiano",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80",
      rating: 4.8,
      category: "Italiano",
    },
    {
      id: "2",
      name: "Mercado Fresh",
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80",
      rating: 4.6,
      category: "Supermercado",
    },
    {
      id: "3",
      name: "Farmácia Saúde",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&q=80",
      rating: 4.7,
      category: "Farmácia",
    },
    {
      id: "4",
      name: "Padaria Delícia",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
      rating: 4.9,
      category: "Padaria",
    },
  ];

  const storeList = stores && stores.length > 0 ? stores : defaultStores;

  const renderItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => onStorePress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.storeImage}
          contentFit="cover"
          transition={300}
        />
      </View>
      <Text style={styles.storeName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.ratingContainer}>
        <Star size={12} color={colors.secondary} fill={colors.secondary} />
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seus favoritos</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={storeList}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  storeItem: {
    width: 140,
    marginRight: 16,
  },
  imageContainer: {
    width: 140,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  storeName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  category: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
