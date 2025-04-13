import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  actionText: string;
  backgroundColor: string;
}

interface HomeCarouselProps {
  banners?: Banner[];
  autoScrollInterval?: number;
}

const { width } = Dimensions.get("window");

export default function HomeCarousel({
  banners = [
    {
      id: "1",
      title: "Free Delivery",
      description: "On your first order over $15",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
      actionText: "Order Now",
      backgroundColor: "#EC1C24",
    },
    {
      id: "2",
      title: "Weekly Groceries",
      description: "20% off on fresh produce",
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
      actionText: "Shop Now",
      backgroundColor: "#FAA61A",
    },
    {
      id: "3",
      title: "Scan & Save",
      description: "Skip the line with Scan & Go",
      imageUrl:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=500&q=80",
      actionText: "Try Now",
      backgroundColor: "#1AB7EA",
    },
  ],
  autoScrollInterval = 5000,
}: HomeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    timerRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollTo(nextIndex);
    }, autoScrollInterval);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [activeIndex]);

  const scrollTo = (index: number) => {
    scrollX.value = withTiming(index * width, { duration: 300 });
    setActiveIndex(index);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -scrollX.value }],
    };
  });

  return (
    <View className="w-full h-[180px] bg-white">
      <View className="relative overflow-hidden w-full h-full">
        <Animated.View
          style={[styles.carouselContainer, animatedStyle]}
          className="flex-row h-full"
        >
          {banners.map((banner) => (
            <View
              key={banner.id}
              style={{ width, backgroundColor: banner.backgroundColor }}
              className="flex-row items-center justify-between px-4 h-full"
            >
              <View className="flex-1 pr-2">
                <Text className="text-white text-xl font-bold mb-1">
                  {banner.title}
                </Text>
                <Text className="text-white text-sm mb-3">
                  {banner.description}
                </Text>
                <TouchableOpacity
                  className="bg-white rounded-full py-2 px-4 flex-row items-center self-start"
                  onPress={() =>
                    console.log(`Action clicked for banner ${banner.id}`)
                  }
                >
                  <Text
                    style={{ color: banner.backgroundColor }}
                    className="font-semibold mr-1"
                  >
                    {banner.actionText}
                  </Text>
                  <ChevronRight size={16} color={banner.backgroundColor} />
                </TouchableOpacity>
              </View>
              <View className="w-[120px] h-[120px] rounded-lg overflow-hidden">
                <Image
                  source={{ uri: banner.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Pagination indicators */}
        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center items-center">
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollTo(index)}
              className="mx-1"
            >
              <View
                className={`h-2 rounded-full ${activeIndex === index ? "w-4" : "w-2"}`}
                style={{
                  backgroundColor:
                    activeIndex === index
                      ? "#FFFFFF"
                      : "rgba(255, 255, 255, 0.5)",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: "row",
  },
});
