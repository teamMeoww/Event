import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { mockPassportCredentials, mockEvents } from '../data/mockData';

export default function CredentialDetailsScreen({ route, navigation }) {
  const { credentialId } = route.params;
  const credential = mockPassportCredentials.find(c => c.id === credentialId);
  const event = mockEvents.find(e => e.title === credential?.title);

  if (!credential) {
    return (
      <View style={styles.center}>
        <Text>Credential not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="ribbon" size={40} color="#000" />
          </View>
          <Text style={styles.credentialName}>{credential.title} 2026</Text>
          
          <View style={styles.issuerRow}>
            <Text style={styles.issuerLabel}>Issued by</Text>
            <Text style={styles.issuerValue}>{event ? event.organizer : 'EventOne'}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <Text style={styles.statusText}>{credential.status}</Text>
          </View>

          <View style={styles.qrWrapper}>
            <QRCode value={credentialId} size={150} />
          </View>

          <Text style={styles.dateText}>{event ? event.fullDate : 'August 30, 2026'}</Text>
        </View>

      </ScrollView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROOF OF ATTENDANCE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: 5,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  credentialName: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    marginBottom: 10,
  },
  issuerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  issuerLabel: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  issuerValue: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginLeft: 5,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 16,
    marginBottom: 20,
  },
  dateText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
  },
  statusText: {
    color: '#16a34a',
    marginBottom: 30,
  },
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  detailValueSuccess: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  proofButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  proofButtonText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
