import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
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
        <Text>Event not found</Text>
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
        <Image source={{ uri: event.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>by {event.organizer}</Text>

          <View style={styles.detailRow}>
            <Feather name="calendar" size={18} color="#666" style={styles.icon} />
            <Text style={styles.detailText}>{event.fullDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="map-pin" size={18} color="#666" style={styles.icon} />
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
          <TouchableOpacity style={styles.ticketButton} onPress={() => navigation.navigate('Tickets')}>
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
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#ddd',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    marginBottom: 5,
  },
  organizer: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
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
    color: '#333',
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
  },
  registerButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  ticketButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  ticketButtonText: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
