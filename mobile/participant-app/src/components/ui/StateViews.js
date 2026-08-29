import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const LoadingState = ({ message = 'Loading...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle-outline" size={48} color={colors.error} style={styles.icon} />
    <Text style={styles.text}>{message}</Text>
    {onRetry && (
      <Button title="Try Again" onPress={onRetry} variant="secondary" style={styles.button} />
    )}
  </View>
);

export const EmptyState = ({ icon = 'folder-open-outline', title = 'No data', message = '', actionTitle, onAction }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={48} color={colors.textSecondary} style={styles.icon} />
    <Text style={styles.title}>{title}</Text>
    {!!message && <Text style={styles.text}>{message}</Text>}
    {onAction && actionTitle && (
      <Button title={actionTitle} onPress={onAction} variant="secondary" style={styles.button} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  icon: {
    marginBottom: spacing.l,
    opacity: 0.8,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.xl,
    minWidth: 150,
  }
});
