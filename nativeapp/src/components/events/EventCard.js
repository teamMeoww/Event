import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const EventCard = ({ event, onPress }) => {
  if (!event) return null;

  const date = new Date(event.startAt || event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <GlassCard intensity={40} style={styles.card}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="calendar-outline" size={40} color={colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Badge text={event.category || 'Event'} status="primary" />
            {event.isBlockchainEnabled && (
              <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
            )}
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
            </View>
          </View>
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
    padding: 0,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.m,
  },
  metaContainer: {
    gap: spacing.s,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flexShrink: 1,
  }
});
