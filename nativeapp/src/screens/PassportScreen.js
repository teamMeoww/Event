import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockUser, mockPassportCredentials } from '../data/mockData';

export default function PassportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.userName}>{mockUser.name.toUpperCase()}</Text>
          <Text style={styles.passportTitle}>EVENT PASSPORT</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{mockUser.verifiedEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{mockUser.contributions}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{mockUser.awards}</Text>
            <Text style={styles.statLabel}>Awards</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{mockUser.reputation}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsSubtitle}>TOTAL CREDENTIALS</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Credentials</Text>
        
        {mockPassportCredentials.map(cred => (
          <TouchableOpacity 
            key={cred.id} 
            style={styles.credentialCard}
            onPress={() => navigation.navigate('CredentialDetails', { credential: cred })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={24} color="#000" />
            </View>
            <View style={styles.credentialInfo}>
              <Text style={styles.credentialName}>{cred.name}</Text>
              <Text style={styles.credentialIssuer}>{cred.issuer}</Text>
            </View>
            <Text style={styles.credentialDate}>{cred.date}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 5,
  },
  passportTitle: {
    fontSize: 16,
    color: '#666',
    letterSpacing: 3,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statBox: {
    width: '45%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 15,
  },
  credentialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  credentialInfo: {
    flex: 1,
  },
});
