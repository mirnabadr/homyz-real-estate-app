import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { GlobalProvider } from "../lib/global-provider";
require("./globals.css");

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show splash screen for minimum 3 seconds
    const timer = setTimeout(() => {
      console.log('✅ 3 seconds passed, setting app as ready...');
      setAppIsReady(true);
    }, 3000);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(timer);
  }, []);

  console.log('📱 App state - appIsReady:', appIsReady, 'fontsLoaded:', fontsLoaded);

  if (!appIsReady) {
    console.log('🖼️ Showing custom splash screen...');
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image 
            source={require("../assets/images/splash.png")} 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={styles.text}>Loading...</Text>
          <Text style={styles.subText}>Homyz</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginTop: 20,
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontFamily: 'Rubik-Regular',
  },
});
