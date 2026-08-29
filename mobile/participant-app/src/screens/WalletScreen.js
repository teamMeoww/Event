import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUser, mockPassportCredentials, mockWallet } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';

export default function WalletScreen() {
  const { logout } = React.useContext(AuthContext);
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.identityCard}>
            <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
            
            <View style={{position: 'relative', zIndex: 10}}>
              <View style={styles.identityHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="shield-checkmark" size={24} color="#8c8cff" style={{marginRight: 10}} />
                  <Text style={styles.identityTitle}>DIGITAL IDENTITY</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#8c8cff" />
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
            <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
            <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative', zIndex: 10}}>
              <Text style={styles.expandText}>Advanced Settings</Text>
              <Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={20} color="#8c8cff" />
            </View>
          </TouchableOpacity>

          {showAdvanced && (
            <View style={styles.advancedSection}>
              <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFillObject} />
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
                <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={{alignItems: 'center', position: 'relative', zIndex: 10}}>
                  <View style={styles.credentialIconContainer}>
                    <Ionicons name={cred.type} size={28} color="#8c8cff" />
                  </View>
                  <Text style={styles.credentialTitle}>{cred.title}</Text>
                  <Text style={styles.credentialStatus}>{cred.status}</Text>
                </View>
              </View>
            ))}
          </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={20} color="#FF453A" style={{marginRight: 8}} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <View style={{height: 60}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  identityCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  identityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  identityTitle: { fontSize: 14, fontWeight: '800', color: '#8c8cff', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(140, 140, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(140,140,255,0.2)' },
  statusText: { fontSize: 12, color: '#8c8cff', fontWeight: '700', marginLeft: 6 },
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15,
  },
  expandText: { color: '#8c8cff', fontWeight: '600', marginRight: 8 },
  advancedSection: { 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
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
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.35)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  credentialIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(140, 140, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(140,140,255,0.2)' },
  credentialType: { fontSize: 24 },
  credentialTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  credentialStatus: { fontSize: 11, color: '#8c8cff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 69, 58, 0.3)', 
    backgroundColor: 'rgba(255, 69, 58, 0.1)' 
  },
  logoutText: { color: '#FF453A', fontSize: 16, fontWeight: '700' }
});
