import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMyTickets } from '../api/ticketApi';
import { TicketCard } from '../components/tickets/TicketCard';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function TicketScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setError(null);
      const data = await getMyTickets();
      const ticketList = data?.content || data || [];
      setTickets(ticketList);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Loading tickets..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTickets} />
      ) : tickets.length === 0 ? (
        <EmptyState 
          icon="ticket-outline"
          title="No tickets yet" 
          message="Register for an event to get your first ticket." 
          actionTitle="Find Events"
          onAction={() => navigation.navigate('Discover')}
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => (item.id || item.ticketId).toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TicketCard 
              ticket={item} 
              onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id || item.ticketId })} 
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.l, paddingBottom: spacing.s },
  title: { ...typography.h1, color: colors.text },
  listContent: { padding: spacing.l, paddingBottom: spacing.huge }
});
