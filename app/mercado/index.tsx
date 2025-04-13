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
  ChevronLeft,
  MapPin,
  ShoppingBag,
  Plus,
} from "lucide-react-native";
import { colors } from "../../components/theme/colors";
import { fontSize, fontWeight } from "../../components/theme/typography";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import Card from "../../components/ui/Card";

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  unit: string;
  category: string;
}

// Sample data for products
const products: Product[] = [
  {
    id: "1",
    name: "Maçã Gala",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80",
    price: "R$ 8,99",
    originalPrice: "R$ 10,99",
    discount: "18%",
    unit: "kg",
    category: "Frutas",
  },
  {
    id: "2",
    name: "Banana Prata",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=80",
    price: "R$ 5,99",
    unit: "kg",
    category: "Frutas",
  },
  {
    id: "3",
    name: "Leite Integral",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80",
    price: "R$ 4,99",
    originalPrice: "R$ 5,99",
    discount: "17%",
    unit: "1L",
    category: "Laticínios",
  },
  {
    id: "4",
    name: "Pão Francês",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80",
    price: "R$ 12,99",
    unit: "kg",
    category: "Padaria",
  },
  {
    id: "5",
    name: "Arroz Branco",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80",
    price: "R$ 21,99",
    unit: "5kg",
    category: "Grãos",
  },
  {
    id: "6",
    name: "Feijão Carioca",
    image:
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&q=80",
    price: "R$ 7,99",
    unit: "1kg",
    category: "Grãos",
  },
  {
    id: "7",
    name: "Coca-Cola",
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80",
    price: "R$ 8,49",
    originalPrice: "R$ 9,99",
    discount: "15%",
    unit: "2L",
    category: "Bebidas",
  },
  {
    id: "8",
    name: "Papel Higiênico",
    image:
      "https://images.unsplash.com/photo-1583251633146-d0c6c036187d?w=500&q=80",
    price: "R$ 18,99",
    unit: "12 rolos",
    category: "Limpeza",
  },
];

// Categories
const categories = [
  "Todos",
  "Ofertas",
  "Frutas",
  "Verduras",
  "Carnes",
  "Laticínios",
  "Padaria",
  "Bebidas",
  "Limpeza",
  "Grãos",
];

export default function MercadoScreen() {
  const [activeTab, setActiveTab] = useState("mercado");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    if (tabKey === "home") {
      router.replace("/home");
    } else if (tabKey === "delivery") {
      router.push("/delivery");
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/mercado/${productId}`);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleAddToCart = (productId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (
      selectedCategory !== "Todos" &&
      selectedCategory !== "Ofertas" &&
      product.category !== selectedCategory
    ) {
      return false;
    }

    // Filter for offers
    if (selectedCategory === "Ofertas" && !product.discount) {
      return false;
    }

    return true;
  });

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <Card
      style={styles.productCard}
      onPress={() => handleProductPress(item.id)}
      elevation={2}
    >
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount}</Text>
        </View>
      )}

      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productUnit}>{item.unit}</Text>

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.productPrice}>{item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item.id)}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
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
          <MapPin size={16} color={colors.secondary} />
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
            placeholder="Buscar produtos"
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
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryItem,
              selectedCategory === category && styles.categoryItemActive,
              selectedCategory === category &&
                (category === "Ofertas"
                  ? { backgroundColor: colors.secondary }
                  : { backgroundColor: colors.secondary }),
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        }
      />

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
  categoriesScrollView: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.support,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  categoryItemActive: {
    backgroundColor: colors.secondary,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: "white",
    fontWeight: fontWeight.bold,
  },
  productsList: {
    padding: 12,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productCard: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    padding: 0,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: "white",
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productUnit: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
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
  cartContainer: {
    position: "absolute",
    bottom: 80, // To account for the bottom tab bar
    left: 16,
    right: 16,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
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
    color: colors.secondary,
  },
  cartButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: "white",
  },
});
