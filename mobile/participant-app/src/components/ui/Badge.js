import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';

export const Badge = ({ text, status = 'default', icon }) => {
  let bgColor = colors.surfaceHighlight;
  let textColor = colors.textSecondary;
  
  if (status === 'success') {
    bgColor = 'rgba(52, 211, 153, 0.15)';
    textColor = colors.success;
  } else if (status === 'primary') {
    bgColor = 'rgba(140, 140, 255, 0.15)';
    textColor = colors.primary;
  } else if (status === 'error') {
    bgColor = 'rgba(239, 68, 68, 0.15)';
    textColor = colors.error;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {icon && <Ionicons name={icon} size={12} color={textColor} style={{ marginRight: 4 }} />}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
  }
});
