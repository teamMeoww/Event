import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

content = """import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { mockUser, mockCategories } from '../data/mockData';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fetch('http://localhost:3001/api/events')
      .then(res => res.json())
      .then(data => {
        setRecommendedEvents(data);
      })
      .catch(err => console.error("Error fetching mock events:", err));
      
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Ambient Glassmorphism Background Glows */}
      <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(94, 92, 230, 0.25)' }]} />
      <View style={[styles.glowOrb, { bottom: 100, right: -100, backgroundColor: 'rgba(10, 132, 255, 0.2)' }]} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 20 }}>
            
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Good evening, {mockUser.name} 👋</Text>
                <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
                <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFillObject} />
                <LottieView
                  source={require('../../assets/android-icon-monochrome.json')}
                  autoPlay
                  loop
                  style={{ width: 44, height: 44 }}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passportCard}>
              <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={{ position: 'relative', zIndex: 10 }}>
                <Text style={styles.passportTitle}>EVENT PASSPORT</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{mockUser.verifiedEvents}</Text>
                    <Text style={styles.statLabel}>Verified Events</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{mockUser.reputation}</Text>
                    <Text style={styles.statLabel}>Reputation</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {mockCategories.map(cat => (
                  <TouchableOpacity key={cat.id} style={styles.categoryCardWrapper}>
                    <View style={styles.categoryCard}>
                      <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFillObject} />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.01)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Events</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
                {recommendedEvents.map(event => (
                  <TouchableOpacity 
                    key={event.id} 
                    style={styles.recommendedCardWrapper}
                    onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                  >
                    <View style={styles.recommendedCard}>
                      <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFillObject} />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <Image source={event.image || { uri: event.image }} style={styles.recommendedImage} />
                      <View style={styles.recommendedInfo}>
                        <Text style={styles.recommendedTitle}>{event.title}</Text>
                        <Text style={styles.recommendedDate}>{event.date}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {recommendedEvents.length === 0 && (
                  <View style={[styles.recommendedCardWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.recommendedCard}>
                       <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFillObject} />
                       <Text style={{color: '#888', marginTop: 10, textAlign: 'center'}}>Loading events...</Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
            
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#050505', // Much darker, lets the ambient orbs pop
  },
  glowOrb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    // Note: Since Expo BlurView handles background blur, we rely on the parent container's child positioning
    // React Native doesn't support 'filter: blur()' on views easily without SVG, so we just use opacity overlays
    // that are heavily blurred by the glass cards floating ABOVE them.
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
  avatarContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },
  passportCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 35, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)', // Specular highlight
    overflow: 'hidden', // Forces the blur and gradient to stay within rounded corners
    backgroundColor: 'rgba(20, 20, 20, 0.4)', // Base tint
  },
  passportTitle: { color: '#8c8cff', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.15)' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  statLabel: { color: '#A0A0A0', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  seeAll: { color: '#8c8cff', fontWeight: '600', fontSize: 15 },
  categoriesScroll: { marginBottom: 35, overflow: 'visible' },
  categoryCardWrapper: {
    marginRight: 12,
  },
  categoryCard: { 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    minWidth: 100, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
  },
  categoryIcon: { fontSize: 28, marginBottom: 10 },
  categoryName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  eventsScroll: { overflow: 'visible' },
  recommendedCardWrapper: {
    width: 280, 
    marginRight: 16,
  },
  recommendedCard: { 
    borderRadius: 20, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
  },
  recommendedImage: { width: '100%', height: 160, opacity: 0.9 }, // Slight opacity to blend with glass
  recommendedInfo: { padding: 16, position: 'relative', zIndex: 10 },
  recommendedTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  recommendedDate: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },
});
"""

with open(filepath, 'w') as f:
    f.write(content)
print("Updated HomeScreen to glassmorphism")
