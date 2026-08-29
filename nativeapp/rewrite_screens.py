import os

passport_path = "/Users/param/crazyones/Event/nativeapp/src/screens/PassportScreen.js"
wallet_path = "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"

passport_content = """import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUser, mockPassportCredentials } from '../data/mockData';

export default function PassportScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.glowOrb, { top: -100, right: -50, backgroundColor: 'rgba(94, 92, 230, 0.25)' }]} />
      <View style={[styles.glowOrb, { bottom: 200, left: -100, backgroundColor: 'rgba(10, 132, 255, 0.2)' }]} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.userName}>{mockUser.name.toUpperCase()}</Text>
            <Text style={styles.headerSubtitle}>EVENT PASSPORT</Text>
          </View>

          <View style={styles.statsGrid}>
            {[
              { num: mockUser.verifiedEvents, label: 'Events' },
              { num: mockUser.contributions, label: 'Contributions' },
              { num: mockUser.awards, label: 'Awards' },
              { num: mockUser.reputation, label: 'Reputation' }
            ].map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={{position: 'relative', zIndex: 10, alignItems: 'center'}}>
                  <Text style={styles.statNumber}>{stat.num}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionDivider}>TOTAL CREDENTIALS</Text>

          <View style={styles.credentialsSection}>
            <Text style={styles.sectionTitle}>Your Credentials</Text>
            {mockPassportCredentials.map(cred => (
              <View key={cred.id} style={styles.credentialItem}>
                <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.01)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.credentialContent}>
                  <View style={styles.credentialIconContainer}>
                    <Text style={styles.credentialIcon}>{cred.type}</Text>
                  </View>
                  <View style={styles.credentialInfo}>
                    <Text style={styles.credentialTitle}>{cred.title}</Text>
                    <Text style={styles.credentialDate}>{cred.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  scrollContent: { padding: 20, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  userName: { fontSize: 28, fontWeight: '800', letterSpacing: 2, color: '#FFFFFF', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#8c8cff', fontWeight: '600', letterSpacing: 3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 40 },
  statCard: { 
    width: '48%', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  statNumber: { fontSize: 24, fontWeight: '800', marginBottom: 5, color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: '#A0A0A0', fontWeight: '600' },
  sectionDivider: { textAlign: 'center', color: '#8c8cff', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 30 },
  credentialsSection: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#FFFFFF' },
  credentialItem: { 
    borderRadius: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  credentialContent: { flexDirection: 'row', padding: 15, alignItems: 'center', position: 'relative', zIndex: 10 },
  credentialIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  credentialIcon: { fontSize: 24 },
  credentialInfo: { flex: 1 },
  credentialTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#FFFFFF' },
  credentialDate: { fontSize: 13, color: '#A0A0A0' }
});
"""

wallet_content = """import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUser, mockPassportCredentials, mockWallet } from '../data/mockData';

export default function WalletScreen() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <View style={styles.container}>
      <View style={[styles.glowOrb, { top: -50, right: -100, backgroundColor: 'rgba(0, 255, 157, 0.15)' }]} />
      <View style={[styles.glowOrb, { bottom: 150, left: -50, backgroundColor: 'rgba(94, 92, 230, 0.2)' }]} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.identityCard}>
            <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
            
            <View style={{position: 'relative', zIndex: 10}}>
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
          </View>

          <TouchableOpacity style={styles.expandButton} onPress={() => setShowAdvanced(!showAdvanced)}>
            <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
            <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative', zIndex: 10}}>
              <Text style={styles.expandText}>Advanced Settings</Text>
              <Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={20} color="#00FF9D" />
            </View>
          </TouchableOpacity>

          {showAdvanced && (
            <View style={styles.advancedSection}>
              <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
              <View style={{position: 'relative', zIndex: 10}}>
                <Text style={styles.advancedText}>Network: Ethereum Mainnet</Text>
                <Text style={styles.advancedText}>Balance: {mockWallet.balance} ETH</Text>
                <TouchableOpacity style={styles.disconnectButton}>
                  <Text style={styles.disconnectText}>Disconnect Identity</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Digital Badges</Text>
          <View style={styles.credentialsGrid}>
            {mockPassportCredentials.map(cred => (
              <View key={cred.id} style={styles.credentialCard}>
                <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={{alignItems: 'center', position: 'relative', zIndex: 10}}>
                  <View style={styles.credentialIconContainer}>
                    <Text style={styles.credentialType}>{cred.type}</Text>
                  </View>
                  <Text style={styles.credentialTitle}>{cred.title}</Text>
                  <Text style={styles.credentialStatus}>{cred.status}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{height: 60}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  glowOrb: { position: 'absolute', width: 350, height: 350, borderRadius: 175 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  identityCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  identityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  identityTitle: { fontSize: 14, fontWeight: '800', color: '#00FF9D', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 255, 157, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,255,157,0.2)' },
  statusText: { fontSize: 12, color: '#00FF9D', fontWeight: '700', marginLeft: 6 },
  addressLabel: { fontSize: 12, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600', marginBottom: 8 },
  addressValue: { fontSize: 16, color: '#E2E8F0', fontWeight: '500', marginBottom: 30, fontFamily: 'Courier', backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tokensContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  tokenBox: { alignItems: 'center', flex: 1 },
  tokenValue: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  detailLabel: { fontSize: 11, color: '#A0A0A0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  expandButton: { 
    borderRadius: 16, 
    marginBottom: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15,
  },
  expandText: { color: '#00FF9D', fontWeight: '600', marginRight: 8 },
  advancedSection: { 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  advancedText: { color: '#A0A0A0', marginBottom: 10, fontWeight: '500' },
  disconnectButton: { marginTop: 10, paddingVertical: 12, backgroundColor: 'rgba(255, 69, 58, 0.1)', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 69, 58, 0.3)' },
  disconnectText: { color: '#FF453A', fontWeight: '700' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 20 },
  credentialsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  credentialCard: { 
    width: '48%', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)'
  },
  credentialIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0, 255, 157, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,255,157,0.2)' },
  credentialType: { fontSize: 24 },
  credentialTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  credentialStatus: { fontSize: 11, color: '#00FF9D', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }
});
"""

with open(passport_path, 'w') as f:
    f.write(passport_content)

with open(wallet_path, 'w') as f:
    f.write(wallet_content)
    
print("Updated Passport and Profile/Wallet screens to glassmorphism")
