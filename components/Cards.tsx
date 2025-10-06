import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";

interface PropertyDocument extends Models.Document {
  name: string;
  address: string;
  price: number;
  rating: number;
  image: string;
  type: string;
}

interface Props {
  item: PropertyDocument;
  onPress?: () => void;
}

export const FeaturedCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative"
    >
      <Image source={{ uri: item.image }} className="size-full rounded-2xl" />

      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-black ml-1" style={{ 
          fontSize: 14, 
          fontWeight: '800',
          fontFamily: 'System',
          letterSpacing: 0.8,
          textShadowColor: 'rgba(255, 255, 255, 0.8)',
          textShadowOffset: { width: 0.5, height: 0.5 },
          textShadowRadius: 1.5
        }}>
          {item.rating}
        </Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <View className="bg-black/30 px-3 py-2 rounded-lg w-full">
          <Text
            className="text-xl font-rubik-extrabold text-white"
            numberOfLines={1}
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2
            }}
          >
            {item.name}
          </Text>
          <Text 
            className="text-base font-rubik text-white" 
            numberOfLines={1}
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2
            }}
          >
            {item.address}
          </Text>

          <View className="flex flex-row items-center justify-between w-full mt-1">
          <Text 
            className="text-2xl text-white" 
            style={{ 
              fontFamily: 'Rubik-ExtraBold',
              fontWeight: '900',
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3
            }}
          >
            ${item.price.toLocaleString()}
          </Text>
            <Image source={icons.heart} className="size-5" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-black ml-0.5" style={{ 
          fontSize: 14, 
          fontWeight: '800',
          fontFamily: 'System',
          letterSpacing: 0.8,
          textShadowColor: 'rgba(255, 255, 255, 0.8)',
          textShadowOffset: { width: 0.5, height: 0.5 },
          textShadowRadius: 1.5
        }}>
          {item.rating}
        </Text>
      </View>

      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.name}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {item.address}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-xl text-blue-500" style={{ fontFamily: 'Rubik-ExtraBold', fontWeight: '900' }}>
            ${item.price.toLocaleString()}
          </Text>
          <Image
            source={icons.heart}
            className="w-5 h-5 mr-2"
            tintColor="#191D31"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};