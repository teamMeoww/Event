import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { mockEvents, mockUser } from '../data/mockData';
import { notifyCheckIn, notifyCredentialIssued, requestNotificationPermissions } from '../utils/notifications';

export default function TicketScreen() {
  const ticketEvent = mockEvents.find(e => e.isRegistered) || mockEvents[0];
  const [checkInState, setCheckInState] = useState('idle');
  const [simulateOffline, setSimulateOffline] = useState(false);
  const netInfo = useNetInfo();
  const isOffline = (netInfo.isConnected === false) || simulateOffline;

  useEffect(() => { requestNotificationPermissions(); }, []);
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
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [checkInState, isOffline, ticketEvent]);

  if (!ticketEvent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}><Text style={{color:'#fff'}}>No tickets found</Text></View>
      </SafeAreaView>
    );
  }

  if (checkInState !== 'idle' && checkInState !== 'checking_in') {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#16a34a" style={{marginBottom: 20}} />
        <Text style={styles.successTitle}>CHECKED IN</Text>
        <Text style={styles.successWelcome}>Welcome to {ticketEvent.title}!</Text>
        {checkInState === 'checked_in' ? (
          <View style={{alignItems: 'center'}}>
            <ActivityIndicator size="small" color="#5E5CE6" style={{marginBottom: 15}} />
            <Text style={{color: '#fff'}}>Issuing your credential...</Text>
          </View>
        ) : (
          <View style={styles.issuedContainer}>
            <Ionicons name="trophy" size={50} color="#FFD700" style={{marginBottom: 15}} />
            <Text style={styles.issuedText}>CREDENTIAL ISSUED</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => setCheckInState('idle')}>
              <Text style={styles.actionButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YOUR TICKET</Text>
        <View style={styles.offlineToggleRow}>
          <Text style={styles.offlineToggleLabel}>Offline Mode</Text>
          <Switch value={simulateOffline} onValueChange={setSimulateOffline} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketTop}>
            <Text style={styles.ticketEventTitle}>{ticketEvent.title.toUpperCase()}</Text>
            <View style={styles.ticketMetaRow}>
              <View style={styles.ticketMetaCol}>
                <Text style={styles.ticketMetaLabel}>DATE</Text>
                <Text style={styles.ticketMetaValue}>{ticketEvent.date}</Text>
              </View>
              <View style={styles.ticketMetaCol}>
                <Text style={styles.ticketMetaLabel}>LOCATION</Text>
                <Text style={styles.ticketMetaValue}>{ticketEvent.location}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.ticketDivider}>
            <View style={[styles.cutout, styles.cutoutLeft]} />
            <View style={styles.dashedLine} />
            <View style={[styles.cutout, styles.cutoutRight]} />
          </View>
          
          <View style={styles.ticketBottom}>
            <Text style={styles.attendeeName}>{mockUser.name}</Text>
            <Text style={styles.attendeeType}>VIP ADMISSION</Text>
            
            <TouchableOpacity 
              style={styles.qrContainer}
              onPress={() => setCheckInState('checking_in')}
              activeOpacity={0.8}
            >
              {checkInState === 'checking_in' ? (
                <View style={styles.qrPlaceholder}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={{color: '#FFFFFF', marginTop: 10}}>Simulating...</Text>
                </View>
              ) : (
                <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 10}}>
                  <QRCode
                    value={`ticket:${mockUser.id}:${ticketEvent.id}`}
                    size={160}
                    color="black"
                    backgroundColor="white"
                  />
                </View>
              )}
            </TouchableOpacity>
            
            <View style={styles.statusContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#00FF9D" />
              <Text style={styles.statusText}>VERIFIED</Text>
            </View>
            <Text style={styles.hintText}>(Tap QR code to simulate scan)</Text>
          </View>
        </View>

        {!isOffline && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.walletButton}>
              <Ionicons name="card-outline" size={20} color="#000" style={{marginRight: 8}} />
              <Text style={styles.walletButtonText}>Save to Apple Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#FFFFFF" style={{marginRight: 8}} />
              <Text style={styles.shareButtonText}>Share Ticket</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F13' },
  header: { alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },
  offlineToggleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  offlineToggleLabel: { color: '#8E8E93', marginRight: 10, fontSize: 14 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  ticketCard: { width: '100%', maxWidth: 340, backgroundColor: '#1C1C1E', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#2C2C2E' },
  ticketTop: { padding: 30, paddingBottom: 20 },
  ticketEventTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 24, textAlign: 'center' },
  ticketMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ticketMetaCol: { flex: 1 },
  ticketMetaLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  ticketMetaValue: { fontSize: 14, color: '#EBEBF5', fontWeight: '600' },
  ticketDivider: { height: 30, justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  dashedLine: { width: '100%', height: 1, borderWidth: 1, borderColor: '#3A3A3C', borderStyle: 'dashed' },
  cutout: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#0F0F13', position: 'absolute', top: 0, borderWidth: 1, borderColor: '#2C2C2E' },
  cutoutLeft: { left: -16 },
  cutoutRight: { right: -16 },
  ticketBottom: { padding: 30, alignItems: 'center' },
  attendeeName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  attendeeType: { fontSize: 13, fontWeight: '700', color: '#5E5CE6', letterSpacing: 1.5, marginBottom: 20 },
  qrContainer: { padding: 15, backgroundColor: '#000000', borderRadius: 20, borderWidth: 1, borderColor: '#3A3A3C', marginBottom: 20 },
  qrPlaceholder: { justifyContent: 'center', alignItems: 'center', height: 160, width: 160 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 255, 157, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  statusText: { color: '#00FF9D', fontSize: 12, fontWeight: '700', marginLeft: 6, letterSpacing: 1 },
  hintText: { fontSize: 12, color: '#8E8E93', fontStyle: 'italic' },
  actionContainer: { width: '100%', maxWidth: 340, marginTop: 30 },
  walletButton: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  walletButtonText: { color: '#000000', fontSize: 16, fontWeight: '700' },
  shareButton: { flexDirection: 'row', backgroundColor: '#1C1C1E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2C2C2E' },
  shareButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  successContainer: { flex: 1, backgroundColor: '#0F0F13', justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 10 },
  successWelcome: { fontSize: 18, color: '#ccc', marginBottom: 40 },
  issuedContainer: { alignItems: 'center', backgroundColor: '#1C1C1E', padding: 30, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  issuedText: { color: '#FFD700', fontSize: 20, fontWeight: '700', letterSpacing: 1, marginBottom: 30 },
  actionButton: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  actionButtonText: { color: '#000', fontWeight: '700', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
