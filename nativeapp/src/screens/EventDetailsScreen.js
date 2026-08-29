import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { mockEvents } from '../data/mockData';
import { notifyRegistrationSuccess } from '../utils/notifications';

export default function EventDetailsScreen({ route, navigation }) {
  const { eventId } = route.params;
  const event = mockEvents.find(e => e.id === eventId);
  const [isRegistered, setIsRegistered] = useState(event?.isRegistered || false);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={{color: '#FFFFFF'}}>Event not found</Text>
      </View>
    );
  }

  const handleRegister = () => {
    Alert.alert('Registration Successful', `You have successfully registered for ${event.title}!`, [
      { text: 'OK', onPress: () => {
        setIsRegistered(true);
        notifyRegistrationSuccess(event.title);
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={event.image || { uri: event.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>by {event.organizer}</Text>

          <View style={styles.detailRow}>
            <Feather name="calendar" size={18} color="#8E8E93" style={styles.icon} />
            <Text style={styles.detailText}>{event.fullDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="map-pin" size={18} color="#8E8E93" style={styles.icon} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        {isRegistered ? (
          <TouchableOpacity 
            style={styles.ticketButton} 
            onPress={() => navigation.navigate('MainTabs', { screen: 'Tickets' })}
          >
            <Text style={styles.ticketButtonText}>VIEW TICKET</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTER</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F13',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F13',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#1C1C1E',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  organizer: {
    fontSize: 16,
    color: '#5E5CE6',
    fontWeight: '600',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#EBEBF5',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // extra padding for safe area
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerButton: {
    backgroundColor: '#5E5CE6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ticketButton: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  ticketButtonText: {
    color: '#00FF9D',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
