import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { categories } from "@/constants/data";

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      router.setParams({ filter: "" });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleCategoryPress(item.category)}
          key={index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.category
              ? "bg-blue-600 border-2 border-blue-700"
              : "bg-gray-100 border border-gray-300"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.category
                ? "text-white font-rubik-extrabold mt-0.5"
                : "text-gray-700 font-rubik-medium"
            }`}
            style={selectedCategory === item.category ? { fontWeight: '900' } : { fontWeight: '600' }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;