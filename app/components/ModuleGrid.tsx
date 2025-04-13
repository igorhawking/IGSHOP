import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  ShoppingBag,
  ShoppingCart,
  QrCode,
  Briefcase,
} from "lucide-react-native";

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onPress?: () => void;
}

interface ModuleGridProps {
  modules?: ModuleItem[];
  onModulePress?: (moduleId: string) => void;
}

export default function ModuleGrid({
  modules = defaultModules,
  onModulePress = (id) => console.log(`Module ${id} pressed`),
}: ModuleGridProps) {
  return (
    <View className="w-full bg-white p-4">
      <Text className="text-lg font-bold mb-3 text-gray-900">Our Services</Text>
      <View className="flex-row flex-wrap justify-between">
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            className={`w-[48%] mb-4 p-4 rounded-xl shadow-sm`}
            style={{ backgroundColor: module.bgColor }}
            onPress={() => onModulePress(module.id)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: module.color }}
            >
              {module.icon}
            </View>
            <Text className="text-base font-bold text-gray-900">
              {module.title}
            </Text>
            <Text className="text-xs text-gray-700 mt-1">
              {module.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const defaultModules: ModuleItem[] = [
  {
    id: "delivery",
    title: "Delivery",
    description: "Food from your favorite restaurants",
    icon: <ShoppingBag size={20} color="#fff" />,
    color: "#EC1C24",
    bgColor: "#FFEEEE",
  },
  {
    id: "market",
    title: "Market",
    description: "Groceries delivered to your door",
    icon: <ShoppingCart size={20} color="#fff" />,
    color: "#FAA61A",
    bgColor: "#FFF6E8",
  },
  {
    id: "scan-go",
    title: "Scan & Go",
    description: "Scan products and skip the line",
    icon: <QrCode size={20} color="#fff" />,
    color: "#1AB7EA",
    bgColor: "#E8F7FF",
  },
  {
    id: "services",
    title: "Services",
    description: "Find professionals for any task",
    icon: <Briefcase size={20} color="#fff" />,
    color: "#0F172A",
    bgColor: "#F0F1F3",
  },
];
