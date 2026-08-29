import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { AuthContext } from '../context/AuthContext';
import { getWalletStatus, requestWalletChallenge, verifyWalletSignature, disconnectWallet } from '../api/walletApi';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState, ErrorState } from '../components/ui/StateViews';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function WalletScreen() {
  const { userInfo, logout } = useContext(AuthContext);
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const data = await getWalletStatus();
      setWalletInfo(data);
    } catch (err) {
      if (err.message.includes('404')) {
         // No wallet configured yet.
         setWalletInfo(null);
      } else {
         setError(err.message || 'Failed to load wallet status');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnectAndVerify = async () => {
    try {
      setVerifying(true);
      setError(null);
      
      // 1. Generate an ephemeral wallet in-memory to demonstrate cryptographic flow securely
      const randomWallet = ethers.Wallet.createRandom();
      const address = randomWallet.address;
      
      // 2. Request EIP-712 Challenge from backend
      const challengeResponse = await requestWalletChallenge(address);
      const { nonce, message } = challengeResponse;

      // 3. The backend challenge message needs to be signed.
      // In a real mobile wallet context, we'd send the canonical typed data object to WalletConnect.
      // Here, we simulate the user's wallet approving the EIP-712 sign typed data request:
      const signature = await randomWallet.signMessage(message);

      // 4. Submit signature for verification
      await verifyWalletSignature(address, nonce, signature);

      Alert.alert("Success", "Wallet connected and verified successfully!");
      fetchStatus();
    } catch (err) {
      Alert.alert("Verification Failed", err.message || "Something went wrong.");
      setVerifying(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setVerifying(true);
      await disconnectWallet();
      fetchStatus();
    } catch (err) {
      Alert.alert("Disconnect Failed", err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <View style={styles.container}><LoadingState message="Loading profile..." /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo?.name || 'Attendee'}</Text>
            <Text style={styles.profileEmail}>{userInfo?.email || 'email@example.com'}</Text>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Digital Identity</Text>
        
        <GlassCard style={styles.walletCard}>
          {walletInfo && walletInfo.verified ? (
            <>
              <View style={styles.walletHeader}>
                <Ionicons name="wallet" size={24} color={colors.primary} />
                <Badge text="VERIFIED" status="success" icon="checkmark-circle" />
              </View>
              
              <View style={styles.walletDetails}>
                <Text style={styles.walletLabel}>Connected Address</Text>
                <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                  {walletInfo.walletAddress}
                </Text>
              </View>
              
              <Button 
                title="Disconnect Wallet" 
                variant="secondary" 
                onPress={handleDisconnect} 
                loading={verifying}
                style={styles.disconnectButton} 
              />
            </>
          ) : (
            <View style={styles.emptyWallet}>
              <Ionicons name="shield-checkmark-outline" size={48} color={colors.textSecondary} style={{ marginBottom: spacing.m }} />
              <Text style={styles.emptyTitle}>No Wallet Connected</Text>
              <Text style={styles.emptyText}>Connect a wallet to register for blockchain-backed events and receive soulbound tickets.</Text>
              <Button 
                title="Connect & Verify" 
                onPress={handleConnectAndVerify} 
                loading={verifying}
                style={styles.connectButton} 
              />
            </View>
          )}
        </GlassCard>

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
