import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#000' : colors.text} />
      ) : (
        <Text style={[
          styles.text, 
          isPrimary ? styles.textPrimary : styles.textSecondary
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: colors.text,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    ...typography.subtitle,
  },
  textPrimary: {
    color: '#000000',
  },
  textSecondary: {
    color: colors.text,
  }
});
