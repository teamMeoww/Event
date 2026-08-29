import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/DiscoverScreen.js"

content = """import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { mockEvents, mockCategories } from '../data/mockData';

export default function DiscoverScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = mockEvents.filter(event => 
    (activeCategory === 'All' || event.category === activeCategory) &&
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={[styles.glowOrb, { top: -50, right: -100, backgroundColor: 'rgba(94, 92, 230, 0.25)' }]} />
      <View style={[styles.glowOrb, { bottom: 150, left: -50, backgroundColor: 'rgba(10, 132, 255, 0.2)' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFillObject} />
          <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search events, organizers..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={{height: 50}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters} contentContainerStyle={{paddingHorizontal: 20}}>
            <TouchableOpacity 
              style={[styles.filterChip, activeCategory === 'All' && styles.activeFilterChip]}
              onPress={() => setActiveCategory('All')}
            >
              {activeCategory !== 'All' && (
                <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
              )}
              <Text style={[styles.filterChipText, activeCategory === 'All' && styles.activeFilterChipText]}>All</Text>
            </TouchableOpacity>
            {mockCategories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.filterChip, activeCategory === cat.name && styles.activeFilterChip]}
                onPress={() => setActiveCategory(cat.name)}
              >
                {activeCategory !== cat.name && (
                   <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
                )}
                <Text style={[styles.filterChipText, activeCategory === cat.name && styles.activeFilterChipText]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.eventsList} showsVerticalScrollIndicator={false}>
          {filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
              
              <Image source={event.image || { uri: event.image }} style={styles.eventImage} />
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{event.date} • {event.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  glowOrb: { position: 'absolute', width: 350, height: 350, borderRadius: 175 },
  header: { paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  searchContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    borderRadius: 16, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  searchIcon: { marginRight: 10, position: 'relative', zIndex: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#FFFFFF', position: 'relative', zIndex: 10 },
  categoryFilters: { marginBottom: 15 },
  filterChip: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: 'rgba(20, 20, 20, 0.4)', 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)', 
    justifyContent: 'center',
    overflow: 'hidden'
  },
  activeFilterChip: { backgroundColor: '#8c8cff', borderColor: '#8c8cff' },
  filterChipText: { color: '#A0A0A0', fontWeight: '600', position: 'relative', zIndex: 10 },
  activeFilterChipText: { color: '#FFFFFF' },
  eventsList: { paddingHorizontal: 20, paddingBottom: 40 },
  eventCard: { 
    borderRadius: 24, 
    marginBottom: 20, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  eventImage: { width: '100%', height: 180, opacity: 0.9, backgroundColor: 'rgba(0,0,0,0.5)' },
  eventInfo: { padding: 18, position: 'relative', zIndex: 10 },
  eventTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6, color: '#FFFFFF' },
  eventMeta: { fontSize: 14, color: '#8c8cff', fontWeight: '600' }
});
"""

with open(filepath, 'w') as f:
    f.write(content)

print("Updated DiscoverScreen to show images and use glassmorphism")
