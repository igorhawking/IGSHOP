import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock, Star } from "lucide-react-native";

interface Store {
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  deliveryTime: string;
}

interface FavoriteStoresProps {
  stores?: Store[];
  onStorePress?: (storeId: string) => void;
}

const FavoriteStores = ({
  stores = [
    {
      id: "1",
      name: "Pizza Express",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pizza",
      category: "Italian",
      rating: 4.8,
      deliveryTime: "25-35 min",
    },
    {
      id: "2",
      name: "Fresh Market",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=market",
      category: "Grocery",
      rating: 4.6,
      deliveryTime: "30-45 min",
    },
    {
      id: "3",
      name: "Burger King",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=burger",
      category: "Fast Food",
      rating: 4.3,
      deliveryTime: "15-25 min",
    },
    {
      id: "4",
      name: "Sushi House",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sushi",
      category: "Japanese",
      rating: 4.9,
      deliveryTime: "35-50 min",
    },
  ],
  onStorePress = (storeId) => console.log(`Store ${storeId} pressed`),
}: FavoriteStoresProps) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-bold text-[#0F172A] mb-3">
        Your Favorites
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-1"
      >
        {stores.map((store) => (
          <TouchableOpacity
            key={store.id}
            className="mx-2 w-[120px]"
            onPress={() => onStorePress(store.id)}
            activeOpacity={0.7}
          >
            <View className="bg-[#F2F2F2] rounded-lg overflow-hidden p-2 shadow-sm">
              <Image
                source={{ uri: store.logo }}
                className="w-16 h-16 rounded-full mx-auto mb-2"
                contentFit="cover"
              />

              <Text
                className="text-[#0F172A] font-semibold text-center text-sm"
                numberOfLines={1}
              >
                {store.name}
              </Text>

              <Text
                className="text-gray-500 text-xs text-center mb-1"
                numberOfLines={1}
              >
                {store.category}
              </Text>

              <View className="flex-row justify-between items-center mt-1">
                <View className="flex-row items-center">
                  <Star size={12} color="#FAA61A" fill="#FAA61A" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {store.rating}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Clock size={12} color="#1AB7EA" />
                  <Text
                    className="text-xs text-gray-600 ml-1"
                    numberOfLines={1}
                  >
                    {store.deliveryTime}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FavoriteStores;
