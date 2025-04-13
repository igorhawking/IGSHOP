import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Star,
  Clock,
  MapPin,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react-native";
import { colors } from "../../components/theme/colors";
import { fontSize, fontWeight } from "../../components/theme/typography";
import Card from "../../components/ui/Card";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  popular?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Sample restaurant data
const restaurantData = {
  id: "1",
  name: "Burger King",
  image:
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
  coverImage:
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
  rating: 4.5,
  reviewCount: 320,
  deliveryTime: "25-35 min",
  deliveryFee: "R$ 5,99",
  minOrder: "R$ 15,00",
  distance: "2,5 km",
  address: "Av. Paulista, 1500 - Bela Vista",
  categories: ["Hambúrguer", "Fast Food"],
  menuCategories: [
    {
      id: "1",
      name: "Combos",
      items: [
        {
          id: "101",
          name: "Combo Whopper",
          description: "Hambúrguer Whopper, batata média e refrigerante 400ml",
          price: "R$ 32,90",
          image:
            "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80",
          popular: true,
        },
        {
          id: "102",
          name: "Combo Duplo Bacon",
          description:
            "Hambúrguer duplo com bacon, batata média e refrigerante 400ml",
          price: "R$ 36,90",
          image:
            "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=500&q=80",
        },
      ],
    },
    {
      id: "2",
      name: "Hambúrgueres",
      items: [
        {
          id: "201",
          name: "Whopper",
          description:
            "Pão, carne grelhada, alface, tomate, cebola, picles, ketchup e maionese",
          price: "R$ 19,90",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
          popular: true,
        },
        {
          id: "202",
          name: "Duplo Bacon",
          description:
            "Pão, duas carnes grelhadas, queijo, bacon, ketchup e maionese",
          price: "R$ 23,90",
          image:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80",
        },
      ],
    },
    {
      id: "3",
      name: "Acompanhamentos",
      items: [
        {
          id: "301",
          name: "Batata Frita Média",
          description: "Porção de batata frita crocante",
          price: "R$ 9,90",
          image:
            "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80",
        },
        {
          id: "302",
          name: "Onion Rings",
          description: "Anéis de cebola empanados",
          price: "R$ 11,90",
          image:
            "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80",
        },
      ],
    },
    {
      id: "4",
      name: "Bebidas",
      items: [
        {
          id: "401",
          name: "Refrigerante 400ml",
          description: "Coca-Cola, Guaraná, Sprite ou Fanta",
          price: "R$ 7,90",
          image:
            "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
        },
        {
          id: "402",
          name: "Suco Natural 300ml",
          description: "Laranja, Limão ou Abacaxi",
          price: "R$ 8,90",
          image:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
        },
      ],
    },
  ],
};

export default function RestaurantScreen() {
  const { restaurantId } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    restaurantData.menuCategories[0].id,
  );
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (itemId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const quantity = cartItems[item.id] || 0;

    return (
      <Card style={styles.menuItemCard} elevation={2}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              {item.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
            <Text style={styles.menuItemPrice}>{item.price}</Text>

            <View style={styles.quantityContainer}>
              {quantity > 0 ? (
                <>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleRemoveFromCart(item.id)}
                  >
                    <Minus size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </>
              ) : null}
              <TouchableOpacity
                style={[styles.quantityButton, styles.addButton]}
                onPress={() => handleAddToCart(item.id)}
              >
                <Plus size={16} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={{ uri: item.image }}
            style={styles.menuItemImage}
            contentFit="cover"
            transition={300}
          />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Heart
            size={24}
            color={isFavorite ? colors.primary : colors.textPrimary}
            fill={isFavorite ? colors.primary : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: restaurantData.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
        />

        <View style={styles.restaurantInfoContainer}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>

          <View style={styles.restaurantMeta}>
            <View style={styles.ratingContainer}>
              <Star
                size={16}
                color={colors.secondary}
                fill={colors.secondary}
              />
              <Text style={styles.ratingText}>
                {restaurantData.rating} ({restaurantData.reviewCount})
              </Text>
            </View>
            <View style={styles.dotSeparator} />
            <View style={styles.timeContainer}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.timeText}>{restaurantData.deliveryTime}</Text>
            </View>
            <View style={styles.dotSeparator} />
            <Text style={styles.distanceText}>{restaurantData.distance}</Text>
          </View>

          <View style={styles.categoriesContainer}>
            {restaurantData.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>

          <View style={styles.addressContainer}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.addressText}>{restaurantData.address}</Text>
          </View>

          <View style={styles.deliveryInfoContainer}>
            <Text style={styles.deliveryInfoText}>
              Entrega: {restaurantData.deliveryFee} • Pedido mínimo:{" "}
              {restaurantData.minOrder}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Cardápio</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScrollView}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {restaurantData.menuCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {restaurantData.menuCategories.map((category) => (
            <View
              key={category.id}
              style={[
                styles.categorySection,
                { display: selectedCategory === category.id ? "flex" : "none" },
              ]}
            >
              <FlatList
                data={category.items}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {getTotalCartItems() > 0 && (
        <View style={styles.cartContainer}>
          <TouchableOpacity style={styles.cartButton}>
            <View style={styles.cartIconContainer}>
              <ShoppingBag size={20} color="white" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalCartItems()}</Text>
              </View>
            </View>
            <Text style={styles.cartButtonText}>Ver Carrinho</Text>
          </TouchableOpacity>
        </View>
      )}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  restaurantInfoContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.support,
  },
  restaurantName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    marginBottom: 12,
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
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  deliveryInfoContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.support,
  },
  deliveryInfoText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  categoriesScrollView: {
    marginBottom: 16,
  },
  categoriesScrollContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: "white",
    fontWeight: fontWeight.bold,
  },
  categorySection: {
    marginBottom: 16,
  },
  menuItemCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginRight: 8,
  },
  popularBadge: {
    backgroundColor: colors.secondary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: fontSize.xs,
    color: colors.secondary,
    fontWeight: fontWeight.bold,
  },
  menuItemDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  quantityText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginRight: 8,
  },
  cartContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartIconContainer: {
    position: "relative",
    marginRight: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  cartButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "white",
  },
});
