import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/navigation/AppNavigator.js"
with open(filepath, "r") as f:
    content = f.read()

imports = """import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Home, Search, Ticket, Contact, WalletCards } from 'lucide-react-native';

const Stack = createNativeStackNavigator();"""

# Replace everything up to const Stack
content = imports + content[content.find("const Stack = createNativeStackNavigator();") + len("const Stack = createNativeStackNavigator();"):]

with open(filepath, "w") as f:
    f.write(content)
