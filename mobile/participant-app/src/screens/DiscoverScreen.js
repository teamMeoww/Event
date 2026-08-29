import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEvents } from '../api/eventApi';
import { EventCard } from '../components/events/EventCard';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function DiscoverScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    try {
      setError(null);
      const data = await getEvents();
      const eventList = data?.content || data || [];
      setEvents(eventList);
    } catch (err) {
      setError(err.message || 'Failed to discover events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, locations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Finding events..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState title="No events found" message="Try adjusting your search criteria." />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => (item.id || item.eventId).toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id || item.eventId })} 
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    paddingBottom: spacing.s,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.l,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    paddingHorizontal: spacing.l,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    ...typography.body,
    height: '100%',
  },
  listContent: {
    padding: spacing.l,
    paddingBottom: spacing.huge,
  }
});
