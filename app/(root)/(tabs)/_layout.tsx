import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View 
    style={{ 
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      minHeight: 60,
      width: '100%',
      maxWidth: '33.33%'
    }}
  >
    <Image
      source={icon}
      tintColor={focused ? "#0061FF" : "#666876"}
      resizeMode="contain"
      style={{ 
        width: 24,
        height: 24,
        marginBottom: 4 
      }}
    />
    <Text
      style={{
        color: focused ? "#0061FF" : "#666876",
        fontSize: 9,
        fontWeight: focused ? "600" : "400",
        textAlign: 'center',
        flexShrink: 0,
        minWidth: 60,
        maxWidth: '100%',
        width: '100%'
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: 90,
          minHeight: 90,
          paddingBottom: 15,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;