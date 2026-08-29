import React, { useContext, useEffect, useState, useRef } from 'react';
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
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 20 }}>
            
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Good evening, {mockUser.name}</Text>
                <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
                <LottieView
                  source={require('../../assets/android-icon-monochrome.json')}
                  autoPlay
                  loop
                  style={{ width: 85, height: 85, marginRight: -10 }}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passportCard}>
              <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFillObject} />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']}
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
                      <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFillObject} />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                      {cat.lottie ? (
                        <LottieView
                          source={cat.lottie}
                          autoPlay
                          loop
                          colorFilters={cat.recolor ? [{ keypath: "**", color: cat.recolor }] : []}
                          style={{ width: 44, height: 44, marginBottom: 5 }}
                        />
                      ) : (
                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      )}
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
                      <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <Image 
                        source={event.id === '1' ? require('../../assets/1148-GC-IO-Header-GC-43-0519.max-2500x2500.jpg') : (typeof event.image === 'string' ? { uri: event.image } : event.image)} 
                        style={styles.recommendedImage} 
                      />
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
                       <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
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
    backgroundColor: '#000000', // Much darker, lets the ambient orbs pop
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
  avatarContainer: { 
    width: 80, 
    height: 80, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  passportCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 35, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.2)', // Specular highlight
    overflow: 'hidden', // Forces the blur and gradient to stay within rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Base tint
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.35)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  recommendedImage: { width: '100%', height: 160, opacity: 0.9 }, // Slight opacity to blend with glass
  recommendedInfo: { padding: 16, position: 'relative', zIndex: 10 },
  recommendedTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  recommendedDate: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },
});
