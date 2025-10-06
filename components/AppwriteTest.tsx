import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { testConnection } from '../lib/appwrite';

const AppwriteTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendPing = async () => {
    setIsLoading(true);
    try {
      // Test Appwrite connection
      const isConnected = await testConnection();
      if (isConnected) {
        Alert.alert('Success', 'Appwrite connection successful!');
      } else {
        Alert.alert('Info', 'Appwrite connection test completed (expected failure for unauthenticated user)');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Appwrite');
      console.error('Appwrite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4">
      <TouchableOpacity
        onPress={sendPing}
        disabled={isLoading}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-bold">
          {isLoading ? 'Testing...' : 'Send a ping'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppwriteTest;
