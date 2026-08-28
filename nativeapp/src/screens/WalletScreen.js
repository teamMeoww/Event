import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockUser, mockPassportCredentials, mockWallet } from '../data/mockData';

export default function WalletScreen() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.identityCard}>
          <View style={styles.identityHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="shield-checkmark" size={24} color="#000" style={{marginRight: 10}} />
              <Text style={styles.identityTitle}>DIGITAL IDENTITY</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          
          <Text style={styles.addressLabel}>Wallet Address</Text>
          <Text style={styles.addressValue}>{mockWallet.address}</Text>
          
          <View style={styles.tokensContainer}>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenValue}>{mockUser.verifiedEvents}</Text>
              <Text style={styles.detailLabel}>Events</Text>
            </View>
            <View style={styles.tokenBox}>
              <Text style={styles.tokenValue}>{mockPassportCredentials.length + 12}</Text>
              <Text style={styles.detailLabel}>Credentials</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.expandButtonText}>Blockchain Details</Text>
          <Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chain ID</Text>
              <Text style={styles.detailValue}>8453</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contract</Text>
              <Text style={styles.detailValue}>0x742...1f8</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Explorer</Text>
              <Text style={styles.detailValue}>Basescan</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  identityCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  identityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  identityTitle: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#16a34a',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    marginLeft: 4,
  },
  addressLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  addressValue: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000',
    marginBottom: 25,
  },
  tokensContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  tokenBox: {
    flex: 1,
  },
  tokenValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: '#000',
    marginBottom: 5,
  },
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  expandButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  detailValue: {
    borderWidth: 1,
    borderColor: '#eee',
  },
  advancedText: {
    color: '#666',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
});
