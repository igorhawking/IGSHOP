import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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
} from "react-native-reanimated";

export default function SplashScreen() {
  // Animation values using Reanimated
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const gradientProgress = useSharedValue(0);
  const exitProgress = useSharedValue(0);

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

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(exitProgress.value * 100, { duration: 500 }) },
      ],
    };
  });

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
      1000,
      withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    // Animate gradient
    gradientProgress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetitions
      true, // Reverse
    );

    // Navigate to onboarding after splash screen with exit animation
    const timer = setTimeout(() => {
      // Start exit animation
      exitProgress.value = withTiming(1, { duration: 500 }, (finished) => {
        if (finished) {
          router.replace("/onboarding");
        }
      });
    }, 2500);

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
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  tagline: {
    fontSize: fontSize.lg,
    color: "white",
    textAlign: "center",
    marginTop: 16,
  },
});
