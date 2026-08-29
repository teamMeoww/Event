import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

export const GlassCard = ({ children, style, intensity = 85 }) => {
  return (
    <View style={[styles.card, style]}>
      <BlurView tint="dark" intensity={intensity} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 1.5,
    borderTopColor: colors.borderLight,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surfaceLight,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    padding: spacing.xl,
  }
});
