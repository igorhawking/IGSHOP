import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Image } from "expo-image";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;
const ITEM_HEIGHT = 160;

type CarouselItem = {
  id: string;
  imageUrl: string;
};

type PromotionalCarouselProps = {
  data: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

export default function PromotionalCarousel({
  data,
  autoPlay = true,
  autoPlayInterval = 5000,
}: PromotionalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Default promotional banners if none provided
  const defaultItems: CarouselItem[] = [
    {
      id: "1",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    },
    {
      id: "2",
      imageUrl:
        "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=800&q=80",
    },
    {
      id: "3",
      imageUrl:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    },
  ];

  const carouselItems = data && data.length > 0 ? data : defaultItems;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoPlay) {
      interval = setInterval(() => {
        if (activeIndex === carouselItems.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        } else {
          flatListRef.current?.scrollToIndex({
            index: activeIndex + 1,
            animated: true,
          });
        }
      }, autoPlayInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeIndex, autoPlay, autoPlayInterval, carouselItems.length]);

  const renderItem = ({ item }: { item: CarouselItem }) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselItems}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_WIDTH,
          );
          setActiveIndex(index);
        }}
        contentContainerStyle={styles.listContainer}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        snapToAlignment="center"
      />

      <View style={styles.pagination}>
        {carouselItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : {},
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.support,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
});
