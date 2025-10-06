import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '@/lib/global-provider';
import { Redirect } from 'expo-router';
import AppwriteTest from '../components/AppwriteTest';
import icons from '../constants/icons';
import images from '../constants/images';
import { login, loginAlternative } from '../lib/appwrite';

const signIn = () => {
  const { refetch, loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    try {
      console.log('Trying primary login method...');
      const session = await login();
      if (session) {
        console.log('Primary login successful');
        Alert.alert('Success', 'Login successful!');
        refetch(); // Refresh user data
        return;
      }
    } catch (error: any) {
      console.log('Primary login failed:', error.message);
      
      try {
        console.log('Trying alternative login method...');
        const session = await loginAlternative();
        if (session) {
          console.log('Alternative login successful');
          Alert.alert('Success', 'Alternative login successful!');
          refetch(); // Refresh user data
          return;
        }
      } catch (altError: any) {
        console.log('Alternative login failed:', altError.message);
        Alert.alert('Error', `Login failed: ${altError.message}`);
      }
    }
  };
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName="h-full">
        <Image source={images.onboarding} className="w-full h-4/6" resizeMode="contain"/>
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">Welcome to Real Estate</Text>
          <View className="mt-2">
            <Text className="text-3xl font-rubik-extra-bold font-extrabold text-black-300 text-center">
              Let's Get you Closer to
            </Text>
            <Text className="text-3xl font-rubik-extra-bold font-extrabold text-center mt-4" style={{color: '#2C5E7A'}}>
              Your Dream Home
            </Text>
          </View>
          <Text className="text-lg font-rubik text-black-200 text-center mt-8">Login to Real Estate with Google</Text>
          <TouchableOpacity onPress={() => {handleLogin()}} className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'>
            <View className='flex flex-row items-center justify-center'>
              <Image source={icons.google} className='w-5 h-5' resizeMode='contain'/>
              <Text className='text-lg font-rubik-medium text-black-300 ml-2'>Continue with Google</Text>
            </View>
          </TouchableOpacity>
          
          {/* Appwrite Test Component */}
          <AppwriteTest />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signIn