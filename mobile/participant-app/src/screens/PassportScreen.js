import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUser, mockPassportCredentials } from '../data/mockData';

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

          <View style={styles.credentialsSection}>
            <Text style={styles.sectionTitle}>Your Credentials</Text>
            {mockPassportCredentials.map(cred => (
              <View key={cred.id} style={styles.credentialItem}>
                <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.credentialContent}>
                  <View style={styles.credentialIconContainer}>
                    <Ionicons name={cred.type} size={28} color="#8c8cff" />
                  </View>
                  <View style={styles.credentialInfo}>
                    <Text style={styles.credentialTitle}>{cred.title}</Text>
                    <Text style={styles.credentialDate}>{cred.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
