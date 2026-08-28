import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { mockEvents, mockUser } from '../data/mockData';
import { notifyCheckIn, notifyCredentialIssued, requestNotificationPermissions } from '../utils/notifications';

export default function TicketScreen() {
  const ticketEvent = mockEvents.find(e => e.isRegistered);
  
  // State for simulating the check-in flow
  // 'idle' -> 'checking_in' -> 'checked_in' -> 'credential_issued'
  const [checkInState, setCheckInState] = useState('idle');
  const [simulateOffline, setSimulateOffline] = useState(false);
  const netInfo = useNetInfo();

  const isOffline = (netInfo.isConnected === false) || simulateOffline;

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    let timer1, timer2;
    if (checkInState === 'checking_in') {
      timer1 = setTimeout(() => {
        setCheckInState('checked_in');
        if (!isOffline) notifyCheckIn(ticketEvent?.title);
      }, 1500);
    } else if (checkInState === 'checked_in') {
      timer2 = setTimeout(() => {
        setCheckInState('credential_issued');
        if (!isOffline) notifyCredentialIssued(ticketEvent?.title);
      }, 2500);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [checkInState, isOffline, ticketEvent]);

  if (!ticketEvent) {
    return (
      <View style={styles.center}>
        <Text style={styles.noTicketText}>No tickets found</Text>
      </View>
    );
  }

  // Render the post-checkin experience
  if (checkInState !== 'idle' && checkInState !== 'checking_in') {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#16a34a" style={styles.successIcon} />
        <Text style={styles.successTitle}>CHECKED IN</Text>
        <Text style={styles.successWelcome}>Welcome to {ticketEvent.title}!</Text>

        {checkInState === 'checked_in' ? (
          <View style={styles.issuingContainer}>
            <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
            <Text style={styles.issuingText}>Issuing your attendance credential...</Text>
          </View>
        ) : (
          <View style={styles.issuedContainer}>
            <Ionicons name="trophy" size={50} color="#FFD700" style={styles.issuedIcon} />
            <Text style={styles.issuedText}>CREDENTIAL ISSUED</Text>
            <TouchableOpacity style={styles.viewCredentialButton} onPress={() => setCheckInState('idle')}>
              <Text style={styles.viewCredentialButtonText}>Return to Ticket</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const renderContent = () => {
    if (isOffline) {
      return (
        <View style={styles.center}>
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerText}>OFFLINE MODE</Text>
          </View>
          <View style={styles.ticketCard}>
            <Text style={styles.eventTitle}>{ticketEvent.title.toUpperCase()}</Text>
            <View style={styles.qrContainer}>
              <QRCode value={`ticket-${ticketEvent.id}-${mockUser.id}`} size={200} />
            </View>
            <Text style={styles.offlineSubText}>This QR code works without an internet connection.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.ticketCard}>
        <Text style={styles.eventTitle}>{ticketEvent.title.toUpperCase()}</Text>
        <Text style={styles.userName}>{mockUser.name}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>DATE & TIME</Text>
            <Text style={styles.detailValue}>{ticketEvent.date}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>LOCATION</Text>
            <Text style={styles.detailValue}>{ticketEvent.location}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.qrContainer}
          onPress={() => setCheckInState('checking_in')}
          activeOpacity={0.8}
        >
          {checkInState === 'checking_in' ? (
            <View style={styles.qrPlaceholder}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.simulatingText}>Simulating Scan...</Text>
            </View>
          ) : (
            <QRCode
              value={`ticket:${mockUser.id}:${ticketEvent.id}`}
              size={200}
              color="black"
              backgroundColor="white"
            />
          )}
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
          <Text style={styles.statusText}>VERIFIED</Text>
        </View>
        <Text style={styles.hintText}>(Tap QR code to simulate organizer scan)</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YOUR TICKET</Text>
        <View style={styles.offlineToggleRow}>
          <Text style={styles.offlineToggleLabel}>Simulate Offline</Text>
          <Switch value={simulateOffline} onValueChange={setSimulateOffline} trackColor={{ true: '#FF3B30', false: '#333' }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
        {!isOffline && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="logo-apple" size={20} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Add to Apple Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Share Ticket</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: 3,
  },
  offlineToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  offlineToggleLabel: {
    color: '#ccc',
    marginRight: 10,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  noTicketText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 100,
    fontFamily: 'Inter_600SemiBold',
  },
  offlineBanner: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  offlineBannerText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  offlineSubText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily: 'Inter_400Regular',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  userName: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
    fontFamily: 'Inter_600SemiBold',
  },
  detailsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
  },
  simulatingText: {
    marginTop: 15,
    color: '#666',
    fontFamily: 'Inter_700Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: '#16a34a',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginLeft: 5,
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    fontSize: 80,
    color: '#00FF00',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 10,
  },
  successWelcome: {
    fontSize: 18,
    color: '#ccc',
    fontFamily: 'Inter_400Regular',
    marginBottom: 40,
    textAlign: 'center',
  },
  issuingContainer: {
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  loader: {
    marginBottom: 15,
  },
  issuingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 24,
  },
  issuedContainer: {
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 30,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
  },
  issuedIcon: {
    marginBottom: 15,
  },
  issuedText: {
    color: '#FFD700',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginBottom: 30,
  },
  viewCredentialButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  viewCredentialButtonText: {
    color: '#000',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});
