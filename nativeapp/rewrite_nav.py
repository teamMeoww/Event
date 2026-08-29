import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/navigation/AppNavigator.js"
content = """import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import TicketScreen from '../screens/TicketScreen';
import PassportScreen from '../screens/PassportScreen';
import CredentialDetailsScreen from '../screens/CredentialDetailsScreen';
import WalletScreen from '../screens/WalletScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF', // Instagram uses white for both, relies on outline vs fill
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000000', // Pure black like Instagram dark mode
          borderTopWidth: 0.5,
          borderTopColor: '#262626', // Subtle dark gray divider
          elevation: 0,
          shadowOpacity: 0,
          height: 60, // Standard height before safe area
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Tickets') {
            // Instagram middle icon is usually a plus, we'll use ticket
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Passport') {
            // Activity or reels equivalent
            iconName = focused ? 'file-tray-full' : 'file-tray-outline'; 
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return (
            <View style={styles.iconWrapper}>
              <Ionicons 
                name={iconName} 
                size={28} 
                color={focused ? '#FFFFFF' : '#A0A0A0'} // Slight dim for inactive to aid visibility
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Tickets" component={TicketScreen} />
      <Tab.Screen name="Passport" component={PassportScreen} />
      <Tab.Screen name="Profile" component={WalletScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {userToken == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: true, title: 'Event Details', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
            <Stack.Screen name="CredentialDetails" component={CredentialDetailsScreen} options={{ headerShown: true, title: 'Credential', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
});
"""

with open(filepath, 'w') as f:
    f.write(content)
print("Updated AppNavigator.js with Instagram-style dock")
