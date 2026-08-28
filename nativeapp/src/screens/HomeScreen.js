import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { mockUser, mockEvents, mockCategories } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const nextEvent = mockEvents.find(e => e.isRegistered);
  const recommendedEvents = mockEvents.filter(e => !e.isRegistered);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening, {mockUser.name} 👋</Text>
          <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.passportCard}>
        <Text style={styles.passportTitle}>EVENT PASSPORT</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mockUser.verifiedEvents}</Text>
            <Text style={styles.statLabel}>Verified Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mockUser.reputation}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
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
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" style={{marginTop: 10}} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.recommendedCard}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <Image source={{ uri: event.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedTitle}>{event.title}</Text>
                <Text style={styles.recommendedDate}>{event.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 30,
    marginTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  passportCard: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
  },
  passportTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  seeAll: {
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  categoriesScroll: {
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  recommendedCard: {
    width: 280,
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#ddd',
  },
  recommendedInfo: {
    padding: 15,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommendedDate: {
    fontSize: 14,
    color: '#666',
  },
});
