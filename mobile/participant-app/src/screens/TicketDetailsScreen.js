import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { getTicketById, getTicketQr } from '../api/ticketApi';
import { LoadingState, ErrorState } from '../components/ui/StateViews';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function TicketDetailsScreen({ route }) {
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      setError(null);
      const [ticketData, qrResponse] = await Promise.all([
        getTicketById(ticketId),
        getTicketQr(ticketId).catch(() => null) // QR might not exist if pending
      ]);
      setTicket(ticketData);
      if (qrResponse && qrResponse.qrToken) {
        setQrData(qrResponse.qrToken);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [ticketId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetails();
  };

  if (loading && !refreshing) {
    return <View style={styles.container}><LoadingState message="Loading ticket..." /></View>;
  }

  if (error || !ticket) {
    return <View style={styles.container}><ErrorState message={error || 'Ticket not found'} onRetry={fetchDetails} /></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        
        <GlassCard style={styles.ticketCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{ticket.eventName || 'EventOne Event'}</Text>
            <Badge text={ticket.status} status={ticket.status === 'ACTIVE' ? 'success' : 'default'} />
          </View>

          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            {qrData ? (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrData}
                  size={200}
                  color="#000"
                  backgroundColor="#FFF"
                />
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.qrPlaceholderText}>QR code not available</Text>
                {ticket.status === 'BLOCKCHAIN_PENDING' && (
                  <Text style={styles.qrSubText}>Waiting for blockchain confirmation...</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>TICKET ID</Text>
              <Text style={styles.detailValue}>#{ticket.id || ticket.ticketId}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>WALLET</Text>
              <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                {ticket.walletAddress || 'N/A'}
              </Text>
            </View>
          </View>

          {ticket.tokenId && (
            <View style={styles.blockchainInfo}>
              <Ionicons name="cube" size={20} color={colors.primary} />
              <View style={styles.blockchainText}>
                <Text style={styles.blockchainLabel}>Blockchain Token ID</Text>
                <Text style={styles.blockchainValue}>{ticket.tokenId}</Text>
              </View>
            </View>
          )}

        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.huge },
  ticketCard: { padding: spacing.xl, backgroundColor: '#FFFFFF' }, // Overriding background to be bright for QR contrast
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h2, color: '#000', marginBottom: spacing.s, textAlign: 'center' },
  qrContainer: { alignItems: 'center', marginVertical: spacing.xl },
  qrWrapper: { padding: spacing.l, backgroundColor: '#FFF', borderRadius: radii.m, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  qrPlaceholder: { height: 200, alignItems: 'center', justifyContent: 'center' },
  qrPlaceholderText: { ...typography.body, color: '#666', marginTop: spacing.m },
  qrSubText: { ...typography.caption, color: '#888', marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: spacing.l },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  detailBox: { flex: 1 },
  detailLabel: { ...typography.caption, color: '#888', marginBottom: spacing.xs },
  detailValue: { ...typography.body, color: '#000', fontWeight: '600' },
  blockchainInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8FF', padding: spacing.m, borderRadius: radii.m, marginTop: spacing.xl },
  blockchainText: { marginLeft: spacing.m },
  blockchainLabel: { ...typography.caption, color: colors.primary },
  blockchainValue: { ...typography.body, color: '#000', fontWeight: 'bold' }
});
