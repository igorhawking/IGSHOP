import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Tag } from "lucide-react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type Deal = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discount: string;
  originalPrice?: string;
  currentPrice: string;
};

type DailyDealsProps = {
  deals?: Deal[];
  onDealPress: (dealId: string) => void;
};

export default function DailyDeals({ deals, onDealPress }: DailyDealsProps) {
  // Default deals if none provided
  const defaultDeals: Deal[] = [
    {
      id: "1",
      title: "Pizza Grande",
      description: "Qualquer sabor com borda recheada",
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
      discount: "30% OFF",
      originalPrice: "R$ 69,90",
      currentPrice: "R$ 49,90",
    },
    {
      id: "2",
      title: "Combo Mercado",
      description: "Frutas, legumes e verduras",
      imageUrl:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&q=80",
      discount: "20% OFF",
      originalPrice: "R$ 120,00",
      currentPrice: "R$ 96,00",
    },
    {
      id: "3",
      title: "Limpeza Residencial",
      description: "Apartamentos até 70m²",
      imageUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
      discount: "15% OFF",
      originalPrice: "R$ 180,00",
      currentPrice: "R$ 153,00",
    },
  ];

  const dealsList = deals && deals.length > 0 ? deals : defaultDeals;

  const renderItem = ({ item }: { item: Deal }) => (
    <TouchableOpacity
      style={styles.dealItem}
      onPress={() => onDealPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.dealImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.discountTag}>
          <Tag size={12} color="white" />
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>

      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
          <Text style={styles.currentPrice}>{item.currentPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promoções do dia</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dealsList}
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
  dealItem: {
    width: 200,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: "100%",
  },
  discountTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    color: "white",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginLeft: 4,
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
    height: 36,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  currentPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
