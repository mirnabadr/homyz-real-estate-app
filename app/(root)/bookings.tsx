import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';

const Bookings = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-6 py-4">
        {/* Header */}
        <View className="flex flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.left} className="w-6 h-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-extrabold text-black-300" style={{ fontWeight: '900' }}>
            My Bookings
          </Text>
          <View className="w-6" />
        </View>

        {/* Bookings List */}
        <View className="space-y-4">
          {/* Sample Booking Card */}
          <View className="bg-white rounded-lg shadow-lg shadow-black-100/70 p-4 border border-gray-200">
            <View className="flex flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-rubik-bold text-black-300 mb-1">
                  Apartment Property 7
                </Text>
                <Text className="text-sm font-rubik text-black-200 mb-2">
                  123 Main Street, City, State
                </Text>
                <View className="flex flex-row items-center mb-2">
                  <View className="bg-blue-100 px-3 py-1 rounded-full mr-2">
                    <Text className="text-xs font-rubik-bold text-blue-700">
                      Apartment
                    </Text>
                  </View>
                  <Text className="text-sm font-rubik text-black-200">
                    4 Beds • 1 Bath • 1302 sqft
                  </Text>
                </View>
              </View>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                className="w-20 h-20 rounded-lg"
              />
            </View>
            
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-rubik-extrabold text-blue-600" style={{ fontWeight: '900' }}>
                  $6,753
                </Text>
                <Text className="text-sm font-rubik text-green-600">
                  Booked on Oct 15, 2024
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-rubik-bold text-green-700">
                  Confirmed
                </Text>
              </View>
            </View>
          </View>

          {/* Empty State */}
          <View className="flex flex-col items-center justify-center py-12">
            <Image 
              source={icons.heart} 
              className="w-16 h-16 mb-4 opacity-50"
              tintColor="#9CA3AF"
            />
            <Text className="text-lg font-rubik-bold text-gray-400 mb-2">
              No bookings yet
            </Text>
            <Text className="text-sm font-rubik text-gray-400 text-center">
              Start exploring properties and book your dream home!
            </Text>
            <TouchableOpacity 
              className="bg-blue-600 px-6 py-3 rounded-lg mt-4"
              onPress={() => router.push('/(root)/(tabs)')}
            >
              <Text className="text-white font-rubik-bold">
                Browse Properties
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookings;
