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

        {error && <ErrorState message={error} onRetry={fetchStatus} />}

        <View style={styles.logoutContainer}>
          <Button title="Log Out" onPress={logout} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl },
  header: { marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.text },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.l, marginBottom: spacing.xxl },
  avatarContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(140, 140, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.l },
  profileInfo: { flex: 1 },
  profileName: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  profileEmail: { ...typography.body, color: colors.textSecondary },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.l },
  walletCard: { padding: spacing.xl, marginBottom: spacing.xxl },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  walletDetails: { marginBottom: spacing.xl },
  walletLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  walletAddress: { ...typography.body, color: colors.text, fontFamily: 'monospace' },
  disconnectButton: { borderColor: colors.error },
  emptyWallet: { alignItems: 'center', paddingVertical: spacing.l },
  emptyTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.s },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  connectButton: { width: '100%' },
  logoutContainer: { marginTop: spacing.huge }
});
