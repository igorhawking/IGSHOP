import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Animated,
} from "react-native";
import { colors } from "../theme/colors";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: number;
  animated?: boolean;
  borderRadius?: number;
  backgroundColor?: string;
  padding?: number;
};

export default function Card({
  children,
  style,
  onPress,
  elevation = 2,
  animated = false,
  borderRadius = 8,
  backgroundColor = "white",
  padding = 16,
}: CardProps) {
  // Create animated value for scale if card is animated
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const getShadow = () => {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation * 1.5,
      elevation: elevation,
    };
  };

  const CardComponent = onPress ? TouchableOpacity : View;
  const AnimatedCardComponent = Animated.createAnimatedComponent(
    CardComponent as any,
  );

  const cardStyles = [
    styles.card,
    getShadow(),
    {
      borderRadius,
      backgroundColor,
      padding,
    },
    style,
  ];

  if (animated && onPress) {
    return (
      <AnimatedCardComponent
        style={[
          cardStyles,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {children}
      </AnimatedCardComponent>
    );
  }

  return (
    <CardComponent style={cardStyles} onPress={onPress}>
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    overflow: "hidden",
  },
});
