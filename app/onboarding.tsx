import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { colors } from "../components/theme/colors";
import { fontSize, fontWeight } from "../components/theme/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Pizza, ShoppingBag, ScanLine, Briefcase } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
  animationDelay: number;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Entregas rápidas de comida",
    description: "Peça sua refeição favorita de restaurantes próximos a você",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    color: colors.primary,
    icon: <Pizza size={32} color={colors.primary} />,
    animationDelay: 0,
  },
  {
    id: "2",
    title: "Supermercado digital",
    description: "Receba suas compras em casa com apenas alguns cliques",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    color: colors.secondary,
    icon: <ShoppingBag size={32} color={colors.secondary} />,
    animationDelay: 100,
  },
  {
    id: "3",
    title: "Scan & Go",
    description: "Escaneie produtos, pague pelo app e evite filas",
    image:
      "https://images.unsplash.com/photo-1512075135822-67cdd9dd7314?w=500&q=80",
    color: colors.action,
    icon: <ScanLine size={32} color={colors.action} />,
    animationDelay: 200,
  },
  {
    id: "4",
    title: "Serviços para seu dia a dia",
    description:
      "Encontre profissionais qualificados para qualquer necessidade",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
    color: colors.backgroundDark,
    icon: <Briefcase size={32} color={colors.backgroundDark} />,
    animationDelay: 300,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Animation values
  const imageAnimation = useSharedValue(0);
  const textAnimation = useSharedValue(0);

  useEffect(() => {
    // Reset and start animations when slide changes
    imageAnimation.value = 0;
    textAnimation.value = 0;

    imageAnimation.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    textAnimation.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      }),
    );
  }, [currentIndex]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      imageAnimation.value,
      [0, 1],
      [0.8, 1],
      Extrapolate.CLAMP,
    );

    const opacity = imageAnimation.value;

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      textAnimation.value,
      [0, 1],
      [20, 0],
      Extrapolate.CLAMP,
    );

    const opacity = textAnimation.value;

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View style={[imageAnimatedStyle, styles.iconContainer]}>
          {item.icon}
        </Animated.View>

        <Animated.View
          style={[
            styles.imageContainer,
            { backgroundColor: item.color + "20" },
            imageAnimatedStyle,
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={500}
          />
        </Animated.View>

        <Animated.View style={textAnimatedStyle}>
          <Text style={[styles.title, { color: item.color }]}>
            {item.title}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: width * 0.8,
    lineHeight: 24,
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
});
