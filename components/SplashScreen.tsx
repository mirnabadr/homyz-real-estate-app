import React, { useEffect } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

export default function CustomSplashScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image 
          source={require('../assets/images/splash.png')} 
          style={styles.image} 
          resizeMode="contain"
        />
        <Text style={styles.text}>Loading...</Text>
        <Text style={styles.subText}>Homyz</Text>
      </Animated.View>
    </View>
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
