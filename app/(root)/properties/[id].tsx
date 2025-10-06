import { facilities } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPropertyById } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Comment from "../../../components/Comment";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  const { data: property, loading, error, refetch } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });

  useEffect(() => {
    if (property) {
      console.log('🏠 Property loaded:', {
        id: property.$id,
        name: property.name,
        reviewsCount: property.reviews?.length || 0,
        galleryCount: property.gallery?.length || 0,
        mainImage: property.image
      });
    }
  }, [property]);

  if (loading) return <SafeAreaView className="flex-1 justify-center items-center bg-white"><Text className="text-lg font-rubik-medium">Loading property...</Text></SafeAreaView>;
  if (error || !property) return <SafeAreaView className="flex-1 justify-center items-center bg-white p-5"><Text className="text-red-500 text-center">Error loading property</Text><TouchableOpacity onPress={() => refetch({ id: id! })} className="mt-4 px-6 py-2 bg-blue-600 rounded-full"><Text className="text-white">Retry</Text></TouchableOpacity></SafeAreaView>;

  const galleryImages = property.gallery || [];
  const reviews = property.reviews || [];

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / windowWidth);
    setCurrentImageIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentImageIndex(index);
  };

  const renderGalleryItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ width: windowWidth - 40 }}>
      <Image
        source={{ uri: item.image || item }}
        className="w-full h-64 rounded-xl"
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 bg-white">
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image source={{ uri: property.image }} className="size-full" resizeMode="cover" />
          <Image source={images.whiteGradient} className="absolute top-0 w-full z-40" />
          <SafeAreaView className="z-50 absolute inset-x-7">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => router.back()} className="bg-primary-200 rounded-full size-11 items-center justify-center">
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-3">
                <Image source={icons.heart} className="size-7" tintColor="#191D31" />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-5 mt-7">
          <Text className="text-2xl font-rubik-extrabold">{property.name}</Text>
          
          <View className="flex-row items-center gap-3 mt-3">
            <View className="bg-blue-600 px-4 py-2 rounded-full">
              <Text className="text-xs font-rubik-extrabold text-white">{property.type}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-400 text-sm" style={{ fontFamily: 'Rubik-ExtraBold', fontWeight: '900' }}>{property.rating} ({reviews.length} reviews)</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-5 gap-7">
            <View className="flex-row items-center">
              <View className="bg-primary-100 rounded-full size-10 items-center justify-center">
                <Image source={icons.bed} className="size-4" />
              </View>
              <Text className="text-black-300 ml-2 font-rubik-medium">{property.bedrooms} Beds</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary-100 rounded-full size-10 items-center justify-center">
                <Image source={icons.bath} className="size-4" />
              </View>
              <Text className="text-black-300 ml-2 font-rubik-medium">{property.bathrooms} Baths</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary-100 rounded-full size-10 items-center justify-center">
                <Image source={icons.area} className="size-4" />
              </View>
              <Text className="text-black-300 ml-2 font-rubik-medium">{property.area} sqft</Text>
            </View>
          </View>

          <View className="border-t border-primary-200 pt-7 mt-7">
            <Text className="text-xl font-rubik-bold text-black-300">Agent</Text>
            <View className="flex-row justify-between items-center mt-4">
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: property.agent?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent?.name || 'Agent')}&background=0EA5E9&color=fff&size=200&bold=true&format=png` }} 
                  className="size-14 rounded-full" 
                />
                <View className="ml-3">
                  <Text className="text-lg font-rubik-bold text-black-300">{property.agent?.name || 'Real Estate Agent'}</Text>
                  <Text className="text-sm font-rubik-medium text-black-200">{property.agent?.email || 'agent@realestate.com'}</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity className="p-2">
                  <Image source={icons.chat} className="size-7" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Image source={icons.phone} className="size-7" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-xl font-rubik-bold text-black-300">Overview</Text>
            <Text className="text-black-200 font-rubik mt-2">{property.description}</Text>
          </View>

          {property.facilities && (
            <View className="mt-7">
              <Text className="text-xl font-rubik-bold text-black-300">Facilities</Text>
              <View className="flex-row flex-wrap gap-5 mt-3">
                {Array.isArray(property.facilities) ? property.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(f => f.title === item);
                  return (
                    <View key={index} className="flex-col items-center min-w-16">
                      <View className="size-14 bg-primary-100 rounded-full items-center justify-center">
                        <Image source={facility?.icon || icons.info} className="size-6" />
                      </View>
                      <Text className="text-black-300 text-sm text-center font-rubik mt-2" numberOfLines={1}>{item}</Text>
                    </View>
                  );
                }) : (
                  <View className="flex-col items-center">
                    <View className="size-14 bg-primary-100 rounded-full items-center justify-center">
                      <Image source={icons.info} className="size-6" />
                    </View>
                    <Text className="text-black-300 text-sm text-center font-rubik mt-2">{property.facilities}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View className="mt-7">
            <Text className="text-xl font-rubik-bold text-black-300 mb-4">Gallery ({galleryImages.length} images)</Text>
            {galleryImages.length > 0 ? (
              <View>
                <FlatList
                  ref={flatListRef}
                  data={galleryImages}
                  renderItem={renderGalleryItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={onScroll}
                  scrollEventThrottle={16}
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                  ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                />
                
                {galleryImages.length > 1 && (
                  <View className="flex-row justify-center mt-4">
                    {galleryImages.map((_: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => scrollToIndex(index)}
                        className={`w-2 h-2 rounded-full mx-1 ${index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </View>
                )}
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                  {galleryImages.slice(0, 5).map((item: any, index: number) => (
                    <TouchableOpacity key={index} onPress={() => scrollToIndex(index)} className="mr-3">
                      <Image source={{ uri: item.image || item }} className="w-20 h-20 rounded-lg" resizeMode="cover" />
                      {galleryImages.length > 5 && index === 4 && (
                        <View className="absolute inset-0 bg-black/70 rounded-lg items-center justify-center">
                          <Text className="text-white font-rubik-bold">+{galleryImages.length - 5}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View className="bg-gray-100 rounded-xl p-8 items-center">
                <Text className="text-gray-500 font-rubik-medium text-center">No gallery images available</Text>
              </View>
            )}
          </View>

          <View className="mt-7">
            <Text className="text-xl font-rubik-bold text-black-300">Location</Text>
            <View className="flex-row items-center mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 font-rubik-medium">{property.address}</Text>
            </View>
            <Image source={images.map} className="h-52 w-full mt-5 rounded-xl" />
          </View>

          <View className="mt-7">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Image source={icons.star} className="size-6" />
                <Text className="text-xl text-black-600 ml-2" style={{ fontFamily: 'Rubik-ExtraBold', fontWeight: '900' }}>{property.rating} ({reviews.length} reviews)</Text>
              </View>
              <TouchableOpacity><Text className="text-primary-300 font-rubik-bold">View All</Text></TouchableOpacity>
            </View>
            
            {reviews.length > 0 ? (
              <View>
                {reviews.map((review: any, index: number) => (
                  <View key={review.$id || index} className={index > 0 ? "mt-4" : ""}>
                    <Comment item={review} />
                  </View>
                ))}
                {reviews.length > 3 && (
                  <TouchableOpacity className="mt-4 p-4 bg-gray-50 rounded-xl items-center">
                    <Text className="text-blue-600 font-rubik-bold">View {reviews.length - 3} more reviews</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View className="bg-gray-100 rounded-xl p-8 items-center">
                <Text className="text-gray-500 font-rubik-medium text-center">No reviews available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white rounded-t-2xl border-t border-primary-200 p-7">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-black-200 text-xs font-rubik-medium">Price</Text>
            <Text className="text-xl text-blue-400" style={{ fontFamily: 'Rubik-ExtraBold', fontWeight: '900' }}>${property.price?.toLocaleString()}</Text>
          </View>
          <TouchableOpacity className="flex-1 bg-blue-700 py-4 rounded-full ml-4 items-center" onPress={() => router.push('/(root)/bookings')}>
            <Text className="text-white text-xl font-rubik-extrabold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;