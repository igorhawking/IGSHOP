import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { colors } from "../components/theme/colors";
import { fontSize, fontWeight } from "../components/theme/typography";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Entregas rápidas de comida",
    description: "Peça sua refeição favorita",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    color: colors.primary,
  },
  {
    id: "2",
    title: "Supermercado digital",
    description: "Receba suas compras em casa",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    color: colors.secondary,
  },
  {
    id: "3",
    title: "Scan & Go",
    description: "Escaneie, compre e vá",
    image:
      "https://images.unsplash.com/photo-1512075135822-67cdd9dd7314?w=500&q=80",
    color: colors.action,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: item.color + "20" },
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={500}
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to login screen when onboarding is complete
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex ? styles.paginationDotActive : {},
              {
                backgroundColor:
                  index === currentIndex ? slides[index].color : colors.support,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: slides[currentIndex].color },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
});
