import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEventById, registerForEvent } from '../api/eventApi';
import { LoadingState, ErrorState } from '../components/ui/StateViews';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function EventDetailsScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    try {
      setError(null);
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    if (event?.isBlockchainEnabled) {
      Alert.alert(
        "Blockchain Registration",
        "This event issues tickets on the blockchain. We'll need to verify your wallet first.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Proceed", 
            onPress: () => navigation.navigate('Profile') // Navigate to Wallet verification
          }
        ]
      );
      return;
    }

    try {
      setRegistering(true);
      // For non-blockchain, just register without wallet
      await registerForEvent(eventId, null, false);
      Alert.alert("Success", "You are registered! Check your tickets.");
      navigation.navigate('Tickets');
    } catch (err) {
      Alert.alert("Registration Failed", err.message || "Failed to register");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <View style={styles.container}><LoadingState message="Loading event details..." /></View>;
  }

  if (error || !event) {
    return <View style={styles.container}><ErrorState message={error || 'Event not found'} onRetry={fetchEvent} /></View>;
  }

  const date = new Date(event.startAt || event.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.badges}>
            <Badge text={event.category || 'Event'} status="primary" />
            {event.isBlockchainEnabled && (
              <Badge text="Blockchain Ticket" icon="cube" status="success" />
            )}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={24} color={colors.primary} style={styles.metaIcon} />
              <View>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{date}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="location" size={24} color={colors.primary} style={styles.metaIcon} />
              <View>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="people" size={24} color={colors.primary} style={styles.metaIcon} />
              <View>
                <Text style={styles.metaLabel}>Availability</Text>
                <Text style={styles.metaValue}>
                  {event.capacity ? `${event.registeredCount || 0} / ${event.capacity} spots` : 'Open'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description || 'No description available.'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={event.status === 'DRAFT' ? 'Not Available' : 'Register Now'} 
          onPress={handleRegister} 
          loading={registering}
          disabled={event.status === 'DRAFT'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.huge * 2 },
  image: { width: '100%', height: 240 },
  imagePlaceholder: { width: '100%', height: 240, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl },
  badges: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.l },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xl },
  metaContainer: { gap: spacing.l, marginBottom: spacing.xxl },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { marginRight: spacing.m },
  metaLabel: { ...typography.caption, color: colors.textSecondary },
  metaValue: { ...typography.body, color: colors.text },
  section: { marginTop: spacing.l },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.m },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: spacing.xl, 
    paddingBottom: spacing.xxl,
    backgroundColor: 'rgba(0,0,0,0.8)', 
    borderTopWidth: 1, borderTopColor: colors.border 
  }
});
