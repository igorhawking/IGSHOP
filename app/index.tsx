import { View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // Redirect to home screen for development
    // In a real app, we would check if the user is logged in
    // and redirect to the appropriate screen
    router.replace("/home");

    // Uncomment to start from splash screen
    // router.replace("/splash");
  }, []);

  return <View className="w-full h-full"></View>;
}
