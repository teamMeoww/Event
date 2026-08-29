import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCredentialById } from '../api/passportApi';
import { LoadingState, ErrorState } from '../components/ui/StateViews';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function CredentialDetailsScreen({ route }) {
  const { credentialId } = route.params;
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      setError(null);
      const data = await getCredentialById(credentialId);
      setCredential(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch credential');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [credentialId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetails();
  };

  if (loading && !refreshing) return <View style={styles.container}><LoadingState message="Loading credential..." /></View>;
  if (error || !credential) return <View style={styles.container}><ErrorState message={error || 'Credential not found'} onRetry={fetchDetails} /></View>;

  const date = new Date(credential.issuedAt || credential.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <GlassCard style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="ribbon" size={64} color={colors.primary} />
          </View>

          <Text style={styles.credentialType}>{credential.credentialType || 'PROOF OF ATTENDANCE'}</Text>
          <Text style={styles.eventName}>{credential.eventName}</Text>

          <Badge 
            text={credential.status === 'REVOKED' ? 'REVOKED' : 'VERIFIED'} 
            status={credential.status === 'REVOKED' ? 'error' : 'success'} 
            icon={credential.status === 'REVOKED' ? 'close-circle' : 'checkmark-circle'}
          />

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>ISSUED DATE</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>WALLET</Text>
              <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                {credential.walletAddress || 'N/A'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {credential.tokenId && (
          <GlassCard style={styles.blockchainCard}>
            <View style={styles.blockchainHeader}>
              <Ionicons name="cube" size={24} color={colors.primary} />
              <Text style={styles.blockchainTitle}>Blockchain Proof</Text>
            </View>
            
            <View style={styles.proofRow}>
              <Text style={styles.proofLabel}>Token ID</Text>
              <Text style={styles.proofValue}>{credential.tokenId}</Text>
            </View>
            
            {credential.mintTransactionHash && (
              <View style={styles.proofRow}>
                <Text style={styles.proofLabel}>Transaction</Text>
                <Text style={styles.proofValue} numberOfLines={1} ellipsizeMode="middle">{credential.mintTransactionHash}</Text>
              </View>
            )}
            
            <Button title="View Verification" variant="secondary" style={styles.verifyButton} />
          </GlassCard>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.huge },
  mainCard: { padding: spacing.xl, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: colors.primary },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(140, 140, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.l },
  credentialType: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.s },
  eventName: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.l },
  divider: { height: 1, backgroundColor: colors.borderLight, width: '100%', marginVertical: spacing.xl },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  detailBox: { flex: 1 },
  detailLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  detailValue: { ...typography.body, color: colors.text },
  blockchainCard: { marginTop: spacing.xl, padding: spacing.l },
  blockchainHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.l },
  blockchainTitle: { ...typography.h3, color: colors.text, marginLeft: spacing.m },
  proofRow: { marginBottom: spacing.m },
  proofLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  proofValue: { ...typography.body, color: colors.primary, fontFamily: 'monospace' },
  verifyButton: { marginTop: spacing.m }
});
