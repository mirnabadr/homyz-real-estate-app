import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import icons from "@/constants/icons";

import { Card, FeaturedCard } from "../../../components/Cards";
import Filters from "../../../components/Filters";
import NoResults from "../../../components/NoResults";
import Search from "../../../components/Search";

import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { useAppwrite } from "@/lib/useAppwrite";

const Home = () => {
  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    refetch,
    loading,
    error,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter || 'All',
      query: params.query || '',
      limit: 6,
    },
  });

  // Debug logging
  useEffect(() => {
    console.log('🏠 Properties data:', { properties, loading, error, count: properties?.length });
  }, [properties, loading, error]);

  useEffect(() => {
    console.log('🔍 Search params changed:', { filter: params.filter, query: params.query });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-extrabold text-black-300" style={{ fontWeight: '900' }}>
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-extrabold text-blue-500" style={{ fontWeight: '900' }}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {latestPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item as any}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            <TouchableOpacity 
              onPress={async () => {
                console.log('🌱 Starting seed...');
                await seed();
                console.log('✅ Seed completed!');
              }}
              className="bg-blue-500 px-4 py-2 rounded-lg mt-2"
            >
              <Text className="text-white text-center font-rubik-medium">Seed Database</Text>
            </TouchableOpacity>

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-extrabold text-black-300" style={{ fontWeight: '900' }}>
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-extrabold text-blue-500" style={{ fontWeight: '900' }}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              <Filters />
              
              {loading ? (
                <ActivityIndicator size="large" className="text-primary-300 mt-5" />
              ) : !properties || properties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={properties}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <Card item={item as any} onPress={() => handleCardPress(item.$id)} />
                  )}
                  keyExtractor={(item) => item.$id}
                  scrollEnabled={false}
                  contentContainerClassName="flex gap-5 mt-5"
                  columnWrapperClassName="flex gap-5"
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;