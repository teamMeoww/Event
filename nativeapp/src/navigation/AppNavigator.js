import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
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

function TabIcon({ focused, outlineName, filledName }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.85,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Ensure it resets safely when unfocused
      scale.setValue(1);
    }
  }, [focused, scale]);

  return (
    <Animated.View style={[styles.iconWrapper, { transform: [{ scale }] }]}>
      <Ionicons 
        name={focused ? filledName : outlineName} 
        size={28} 
        color={focused ? '#FFFFFF' : '#A0A0A0'} 
      />
    </Animated.View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0.5,
          borderTopColor: '#262626',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarIcon: ({ focused }) => {
          let outlineName, filledName;

          if (route.name === 'Home') {
            outlineName = 'home-outline';
            filledName = 'home';
          } else if (route.name === 'Discover') {
            outlineName = 'search-outline';
            filledName = 'search';
          } else if (route.name === 'Tickets') {
            outlineName = 'ticket-outline';
            filledName = 'ticket';
          } else if (route.name === 'Passport') {
            outlineName = 'file-tray-outline'; 
            filledName = 'file-tray-full';
          } else if (route.name === 'Profile') {
            outlineName = 'person-circle-outline';
            filledName = 'person-circle';
          }

          return <TabIcon focused={focused} outlineName={outlineName} filledName={filledName} />;
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
