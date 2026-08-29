import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../api/eventApi';
import { AuthContext } from '../context/AuthContext';
import { EventCard } from '../components/events/EventCard';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';

export default function HomeScreen({ navigation }) {
  const { userInfo } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setError(null);
      const data = await getEvents();
      // Usually returns a page. Extract content.
      const eventList = data?.content || data || [];
      setEvents(eventList.slice(0, 3)); // Only show top 3 on home
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <LoadingState message="Loading your events..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {userInfo?.name || 'Attendee'}
          </Text>
          <Text style={styles.subtitle}>Ready for your next event?</Text>
        </View>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userInfo?.verifiedEvents || 0}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userInfo?.reputationScore || 0}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
        </GlassCard>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
        </View>

        {error ? (
          <ErrorState message={error} onRetry={fetchHomeData} />
        ) : events.length === 0 ? (
          <EmptyState 
            title="No events right now" 
            message="Check back later for new experiences." 
            actionTitle="Discover"
            onAction={() => navigation.navigate('Discover')}
          />
        ) : (
          <View style={styles.eventsList}>
            {events.map((event) => (
              <EventCard 
                key={event.id || event.eventId} 
                event={event} 
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id || event.eventId })} 
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: spacing.huge,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.s,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.l,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  sectionHeader: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  eventsList: {
    gap: spacing.l,
  }
});
