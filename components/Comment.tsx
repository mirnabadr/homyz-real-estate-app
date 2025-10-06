import icons from '@/constants/icons';
import { Image, Text, View } from 'react-native';

interface CommentProps {
  item: {
    $id: string;
    name?: string;
    review?: string;
    avatar?: string;
    rating?: number;
  }
}

const Comment = ({ item }: CommentProps) => {
  return (
    <View className="bg-white p-4 rounded-xl border border-gray-100">
      <View className="flex flex-row items-start gap-3">
        <Image 
          source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}&background=FF6B6B&color=FFFFFF&size=200&bold=true&format=png` }} 
          className="w-12 h-12 rounded-full" 
          defaultSource={{ uri: 'https://via.placeholder.com/48x48/FF6B6B/FFFFFF?text=U' }}
        />
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="font-rubik-bold text-black-300">{item.name || 'Anonymous'}</Text>
            {item.rating && (
              <View className="flex flex-row items-center">
                <Image source={icons.star} className="w-4 h-4" />
                <Text className="text-sm font-rubik-medium ml-1">{item.rating}</Text>
              </View>
            )}
          </View>
          <Text className="text-black-200 font-rubik text-sm leading-5">{item.review || 'Great property!'}</Text>
        </View>
      </View>
    </View>
  );
};

export default Comment;