import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Ionicons name="construct-outline" size={64} color={colors.primary} style={{ marginBottom: spacing.l }} />
            <Text style={styles.title}>Under Construction</Text>
            <Text style={styles.subtitle}>Password recovery is not yet supported by the EventOne backend services.</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xxl },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: spacing.xl },
  headerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.m },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 }
});
