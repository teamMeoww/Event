import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const TicketCard = ({ ticket, onPress }) => {
  if (!ticket) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'BLOCKCHAIN_PENDING': return 'warning';
      case 'USED': 
      case 'CHECKED_IN': return 'primary';
      case 'CANCELLED': 
      case 'REVOKED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace('_', ' ') || 'UNKNOWN';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.eventId} numberOfLines={1}>TICKET #{ticket.id || ticket.ticketId}</Text>
          <Badge 
            text={getStatusLabel(ticket.status)} 
            status={getStatusColor(ticket.status)} 
          />
        </View>

        <Text style={styles.title} numberOfLines={2}>{ticket.eventName || 'EventOne Event'}</Text>
        
        {ticket.tokenId && (
          <View style={styles.blockchainBadge}>
            <Ionicons name="cube" size={14} color={colors.primary} />
            <Text style={styles.blockchainText}>Token ID: {ticket.tokenId}</Text>
          </View>
        )}
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
    width: '100%',
  },
  card: {
    padding: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  eventId: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.s,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.m,
  },
  blockchainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 140, 255, 0.1)',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  blockchainText: {
    ...typography.caption,
    color: colors.primary,
  }
});
