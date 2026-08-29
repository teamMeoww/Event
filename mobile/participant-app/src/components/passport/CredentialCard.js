import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const CredentialCard = ({ credential, onPress }) => {
  if (!credential) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.typeLabel} numberOfLines={1}>
            {credential.credentialType || 'PROOF OF ATTENDANCE'}
          </Text>
          <Badge 
            text={credential.status === 'REVOKED' ? 'REVOKED' : 'VERIFIED'} 
            status={credential.status === 'REVOKED' ? 'error' : 'success'} 
            icon={credential.status === 'REVOKED' ? 'close-circle' : 'checkmark-circle'}
          />
        </View>

        <Text style={styles.title} numberOfLines={2}>{credential.eventName}</Text>
        
        <View style={styles.metaRow}>
          <Ionicons name="cube-outline" size={14} color={colors.primary} />
          <Text style={styles.blockchainText}>Token ID: {credential.tokenId || 'N/A'}</Text>
        </View>
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
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  typeLabel: {
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockchainText: {
    ...typography.caption,
    color: colors.primary,
  }
});
