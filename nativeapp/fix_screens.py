import os

BASE_DIR = "/Users/param/crazyones/Event/nativeapp/src/screens"

def write_file(filename, content):
    with open(os.path.join(BASE_DIR, filename), 'w') as f:
        f.write(content)

# 1. Fix HomeScreen
home_content = """import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { mockUser, mockCategories } from '../data/mockData';

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 20 }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good evening, {mockUser.name} 👋</Text>
              <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color="#5E5CE6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.passportCard}>
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
                  style={styles.recommendedCard}
                  onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                >
                  <Image source={event.image || { uri: event.image }} style={styles.recommendedImage} />
                  <View style={styles.recommendedInfo}>
                    <Text style={styles.recommendedTitle}>{event.title}</Text>
                    <Text style={styles.recommendedDate}>{event.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {recommendedEvents.length === 0 && (
                <View style={styles.loadingBox}>
                  <Text style={{color: '#888', marginTop: 10}}>Loading events...</Text>
                </View>
              )}
            </ScrollView>
          </View>
          
          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F13' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
  logoutBtn: { backgroundColor: 'rgba(94, 92, 230, 0.15)', padding: 10, borderRadius: 12 },
  passportCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 24, padding: 24, marginBottom: 35, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  passportTitle: { color: '#5E5CE6', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  statLabel: { color: '#8E8E93', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  seeAll: { color: '#5E5CE6', fontWeight: '600', fontSize: 15 },
  categoriesScroll: { marginBottom: 35, overflow: 'visible' },
  categoryCard: { backgroundColor: '#1C1C1E', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, marginRight: 12, alignItems: 'center', minWidth: 100, borderWidth: 1, borderColor: '#2C2C2E' },
  categoryIcon: { fontSize: 28, marginBottom: 10 },
  categoryName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  eventsScroll: { overflow: 'visible' },
  recommendedCard: { width: 280, marginRight: 16, backgroundColor: '#1C1C1E', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#2C2C2E' },
  recommendedImage: { width: '100%', height: 160, backgroundColor: '#2C2C2E' },
  recommendedInfo: { padding: 16 },
  recommendedTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  recommendedDate: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },
  loadingBox: { width: 280, height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1E', borderRadius: 20 }
});
"""
write_file("HomeScreen.js", home_content)

# 2. Fix TicketScreen
ticket_content = """import React, { useState, useEffect } from 'react';
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
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
"""
write_file("TicketScreen.js", ticket_content)

# 3. Fix WalletScreen
wallet_content = """import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockUser, mockPassportCredentials, mockWallet } from '../data/mockData';

export default function WalletScreen() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.identityCard}>
          <View style={styles.identityHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="shield-checkmark" size={24} color="#00FF9D" style={{marginRight: 10}} />
              <Text style={styles.identityTitle}>DIGITAL IDENTITY</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#00FF9D" />
              <Text style={styles.statusText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.addressLabel}>Wallet Address</Text>
          <Text style={styles.addressValue}>{mockWallet.address}</Text>
          <View style={styles.tokensContainer}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenValue}>{mockUser.verifiedEvents}</Text>
              <Text style={styles.detailLabel}>Events</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.tokenBox}>
              <Text style={styles.tokenValue}>{mockPassportCredentials.length}</Text>
              <Text style={styles.detailLabel}>Credentials</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.expandButton} onPress={() => setShowAdvanced(!showAdvanced)}>
          <Text style={styles.expandText}>Advanced Settings</Text>
          <Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={20} color="#00FF9D" />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            <Text style={styles.advancedText}>Network: Ethereum Mainnet</Text>
            <Text style={styles.advancedText}>Balance: {mockWallet.balance} ETH</Text>
            <TouchableOpacity style={styles.disconnectButton}>
              <Text style={styles.disconnectText}>Disconnect Identity</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Digital Badges</Text>
        <View style={styles.credentialsGrid}>
          {mockPassportCredentials.map(cred => (
            <View key={cred.id} style={styles.credentialCard}>
              <View style={styles.credentialIconContainer}>
                <Text style={styles.credentialType}>{cred.type}</Text>
              </View>
              <Text style={styles.credentialTitle}>{cred.title}</Text>
              <Text style={styles.credentialStatus}>{cred.status}</Text>
            </View>
          ))}
        </View>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0C10' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  identityCard: { backgroundColor: 'rgba(30, 35, 45, 0.6)', borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(0, 255, 157, 0.2)' },
  identityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  identityTitle: { fontSize: 14, fontWeight: '800', color: '#00FF9D', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 255, 157, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, color: '#00FF9D', fontWeight: '700', marginLeft: 6 },
  addressLabel: { fontSize: 12, color: '#8A95A5', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600', marginBottom: 8 },
  addressValue: { fontSize: 16, color: '#E2E8F0', fontWeight: '500', marginBottom: 30, fontFamily: 'Courier', backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 12, overflow: 'hidden' },
  tokensContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 16 },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  tokenBox: { alignItems: 'center', flex: 1 },
  tokenValue: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  detailLabel: { fontSize: 11, color: '#8A95A5', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  expandButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: 'rgba(0, 255, 157, 0.05)', borderRadius: 16, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(0, 255, 157, 0.1)' },
  expandText: { color: '#00FF9D', fontWeight: '600', marginRight: 8 },
  advancedSection: { backgroundColor: 'rgba(30, 35, 45, 0.4)', padding: 20, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  advancedText: { color: '#8A95A5', marginBottom: 10, fontWeight: '500' },
  disconnectButton: { marginTop: 10, paddingVertical: 12, backgroundColor: 'rgba(255, 69, 58, 0.1)', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 69, 58, 0.3)' },
  disconnectText: { color: '#FF453A', fontWeight: '700' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 20 },
  credentialsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  credentialCard: { width: '48%', backgroundColor: 'rgba(30, 35, 45, 0.6)', padding: 20, borderRadius: 20, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  credentialIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0, 255, 157, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  credentialType: { fontSize: 24 },
  credentialTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  credentialStatus: { fontSize: 11, color: '#00FF9D', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }
});
"""
write_file("WalletScreen.js", wallet_content)

# 4. Fix DiscoverScreen (Light mode to Dark mode)
discover_content = """import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockEvents, mockCategories } from '../data/mockData';

export default function DiscoverScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = mockEvents.filter(event => 
    (activeCategory === 'All' || event.category === activeCategory) &&
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search events, organizers..."
          placeholderTextColor="#8E8E93"
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
            <Text style={[styles.filterChipText, activeCategory === 'All' && styles.activeFilterChipText]}>All</Text>
          </TouchableOpacity>
          {mockCategories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.filterChip, activeCategory === cat.name && styles.activeFilterChip]}
              onPress={() => setActiveCategory(cat.name)}
            >
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
            <View style={styles.eventImagePlaceholder} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventMeta}>{event.date} • {event.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F13' },
  header: { paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', marginHorizontal: 20, borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#2C2C2E' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#FFFFFF' },
  categoryFilters: { marginBottom: 15 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1C1C1E', marginRight: 10, borderWidth: 1, borderColor: '#2C2C2E', justifyContent: 'center' },
  activeFilterChip: { backgroundColor: '#5E5CE6', borderColor: '#5E5CE6' },
  filterChipText: { color: '#8E8E93', fontWeight: '600' },
  activeFilterChipText: { color: '#FFFFFF' },
  eventsList: { paddingHorizontal: 20, paddingBottom: 40 },
  eventCard: { backgroundColor: '#1C1C1E', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#2C2C2E' },
  eventImagePlaceholder: { width: '100%', height: 160, backgroundColor: '#2C2C2E' },
  eventInfo: { padding: 15 },
  eventTitle: { fontSize: 18, fontWeight: '700', marginBottom: 5, color: '#FFFFFF' },
  eventMeta: { fontSize: 14, color: '#5E5CE6', fontWeight: '600' }
});
"""
write_file("DiscoverScreen.js", discover_content)

# 5. Fix PassportScreen (Light mode to Dark mode)
passport_content = """import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockUser, mockPassportCredentials } from '../data/mockData';

export default function PassportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.userName}>{mockUser.name.toUpperCase()}</Text>
          <Text style={styles.headerSubtitle}>EVENT PASSPORT</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockUser.verifiedEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockUser.contributions}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockUser.awards}</Text>
            <Text style={styles.statLabel}>Awards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockUser.reputation}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
        </View>

        <Text style={styles.sectionDivider}>TOTAL CREDENTIALS</Text>

        <View style={styles.credentialsSection}>
          <Text style={styles.sectionTitle}>Your Credentials</Text>
          {mockPassportCredentials.map(cred => (
            <View key={cred.id} style={styles.credentialItem}>
              <View style={styles.credentialIconContainer}>
                <Text style={styles.credentialIcon}>{cred.type}</Text>
              </View>
              <View style={styles.credentialInfo}>
                <Text style={styles.credentialTitle}>{cred.title}</Text>
                <Text style={styles.credentialDate}>{cred.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F13' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  userName: { fontSize: 28, fontWeight: '800', letterSpacing: 2, color: '#FFFFFF', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#8E8E93', fontWeight: '600', letterSpacing: 3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 40 },
  statCard: { width: '48%', backgroundColor: '#1C1C1E', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#2C2C2E' },
  statNumber: { fontSize: 24, fontWeight: '800', marginBottom: 5, color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  sectionDivider: { textAlign: 'center', color: '#5E5CE6', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 30 },
  credentialsSection: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#FFFFFF' },
  credentialItem: { flexDirection: 'row', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 16, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2C2C2E' },
  credentialIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(94, 92, 230, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  credentialIcon: { fontSize: 24 },
  credentialInfo: { flex: 1 },
  credentialTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#FFFFFF' },
  credentialDate: { fontSize: 13, color: '#8E8E93' }
});
"""
write_file("PassportScreen.js", passport_content)

print("All screens updated with SafeAreaView and Dark Mode fixes!")
