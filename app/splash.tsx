import { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { colors } from "../components/theme/colors";
import { fontSize, fontWeight } from "../components/theme/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
  withRepeat,
  runOnJS,
} from "react-native-reanimated";
import { ShoppingBag, Pizza, ScanLine, Briefcase } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  // Animation values using Reanimated
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const gradientProgress = useSharedValue(0);
  const exitProgress = useSharedValue(0);
  const iconsOpacity = useSharedValue(0);
  const iconsScale = useSharedValue(0.5);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [
        { scale: logoScale.value },
        {
          translateY: withTiming(exitProgress.value * -100, { duration: 500 }),
        },
      ],
    };
  });

  const taglineAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: taglineOpacity.value,
      transform: [
        {
          translateY: withTiming(exitProgress.value * -100, { duration: 500 }),
        },
      ],
    };
  });

  const iconsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: iconsOpacity.value,
      transform: [
        { scale: iconsScale.value },
        {
          translateY: withTiming(exitProgress.value * -100, { duration: 500 }),
        },
      ],
    };
  });

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(exitProgress.value * 100, { duration: 500 }) },
      ],
    };
  });

  const navigateToOnboarding = () => {
    router.replace("/onboarding");
  };

  useEffect(() => {
    // Animate logo fade in and scale up
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });

    // Animate tagline fade in after logo
    taglineOpacity.value = withDelay(
      800,
      withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    // Animate icons fade in and scale up after tagline
    iconsOpacity.value = withDelay(
      1400,
      withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    iconsScale.value = withDelay(
      1400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
      }),
    );

    // Animate gradient
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetitions
      true, // Reverse
    );

    // Navigate to onboarding after splash screen with exit animation
    const timer = setTimeout(() => {
      // Start exit animation
      exitProgress.value = withTiming(1, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(navigateToOnboarding)();
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, gradientAnimatedStyle]}>
      <LinearGradient
        colors={[
          colors.gradientStart,
          colors.gradientMiddle,
          colors.gradientEnd,
        ]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Text style={styles.logoText}>TudoGo</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
          Tudo o que você precisa, em um só app
        </Animated.Text>

        <Animated.View style={[styles.iconsContainer, iconsAnimatedStyle]}>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.primary }]}
          >
            <Pizza size={24} color="white" />
          </View>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.secondary }]}
          >
            <ShoppingBag size={24} color="white" />
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.action }]}>
            <ScanLine size={24} color="white" />
          </View>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.backgroundDark },
            ]}
          >
            <Briefcase size={24} color="white" />
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary, // Fallback color
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: fontSize.lg,
    color: "white",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 32,
    maxWidth: width * 0.8,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
