import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { mockUser, mockPassportCredentials } from '../data/mockData';

export default function PassportScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.userName}>{mockUser.name.toUpperCase()}</Text>
            <Text style={styles.headerSubtitle}>EVENT PASSPORT</Text>
          </View>

          <View style={styles.statsGrid}>
            {[
              { num: mockUser.verifiedEvents, label: 'Events' },
              { num: mockUser.contributions, label: 'Contributions' },
              { num: mockUser.awards, label: 'Awards' },
              { num: mockUser.reputation, label: 'Reputation' }
            ].map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={{position: 'relative', zIndex: 10, alignItems: 'center'}}>
                  <Text style={styles.statNumber}>{stat.num}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionDivider}>TOTAL CREDENTIALS</Text>

          <View style={styles.credentialsSection}>
            <Text style={styles.sectionTitle}>Your Credentials</Text>
            {mockPassportCredentials.map(cred => (
              <View key={cred.id} style={styles.credentialItem}>
                <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFillObject} />
                <LinearGradient colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.credentialContent}>
                  <View style={styles.credentialIconContainer}>
                    <Text style={styles.credentialIcon}>{cred.type}</Text>
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
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  userName: { fontSize: 28, fontWeight: '800', letterSpacing: 2, color: '#FFFFFF', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#8c8cff', fontWeight: '600', letterSpacing: 3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 40 },
  statCard: { 
    width: '48%', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  statNumber: { fontSize: 24, fontWeight: '800', marginBottom: 5, color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: '#A0A0A0', fontWeight: '600' },
  sectionDivider: { textAlign: 'center', color: '#8c8cff', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 30 },
  credentialsSection: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#FFFFFF' },
  credentialItem: { 
    borderRadius: 16, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.35)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
  },
  credentialContent: { flexDirection: 'row', padding: 15, alignItems: 'center', position: 'relative', zIndex: 10 },
  credentialIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  credentialIcon: { fontSize: 24 },
  credentialInfo: { flex: 1 },
  credentialTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#FFFFFF' },
  credentialDate: { fontSize: 13, color: '#A0A0A0' }
});
