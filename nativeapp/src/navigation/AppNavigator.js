import React, { useContext } from 'react';
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
        tabBarActiveTintColor: '#007AFF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Tickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Passport') {
            iconName = focused ? 'id-card' : 'id-card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Tickets" component={TicketScreen} />
      <Tab.Screen name="Passport" component={PassportScreen} />
      <Tab.Screen name="Profile" component={WalletScreen} options={{ title: 'Wallet' }} />
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: true, title: 'Event Details' }} />
            <Stack.Screen name="CredentialDetails" component={CredentialDetailsScreen} options={{ headerShown: true, title: 'Credential' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
