import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMyPassport, getMyCredentials } from '../api/passportApi';
import { CredentialCard } from '../components/passport/CredentialCard';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews';
import { GlassCard } from '../components/ui/GlassCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function PassportScreen({ navigation }) {
  const [passport, setPassport] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [passportData, credsData] = await Promise.all([
        getMyPassport().catch(() => null), // Passport might not exist if 0 events
        getMyCredentials().catch(() => [])
      ]);
      setPassport(passportData);
      const credList = credsData?.content || credsData || [];
      setCredentials(credList);
    } catch (err) {
      setError(err.message || 'Failed to fetch passport details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Passport</Text>
      <GlassCard style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{passport?.verifiedEvents || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{passport?.reputationScore || 0}</Text>
          <Text style={styles.statLabel}>Reputation</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{credentials.length}</Text>
          <Text style={styles.statLabel}>Credentials</Text>
        </View>
      </GlassCard>
      <Text style={styles.sectionTitle}>Digital Credentials</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading && !refreshing ? (
        <LoadingState message="Loading your passport..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <FlatList
          data={credentials}
          keyExtractor={(item) => (item.id || item.credentialId).toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState 
              icon="school-outline"
              title="No credentials yet" 
              message="Attend events to earn verifiable digital credentials." 
            />
          }
          renderItem={({ item }) => (
            <CredentialCard 
              credential={item} 
              onPress={() => navigation.navigate('CredentialDetails', { credentialId: item.id || item.credentialId })} 
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
  listContent: { padding: spacing.xl, paddingBottom: spacing.huge },
  headerContainer: { marginBottom: spacing.l },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xl },
  statsCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.xxl },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { ...typography.h2, color: colors.primary, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: colors.borderLight },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.s }
});
