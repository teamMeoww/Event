import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';
import { Button } from '../components/ui/Button';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#000000']} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Ionicons name="infinite" size={40} color={colors.primary} />
              </View>
              <Text style={styles.title}>EventOne</Text>
              <Text style={styles.subtitle}>Welcome back</Text>
            </View>

            <View style={styles.formContainer}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <Button 
                title="Sign In" 
                onPress={handleLogin} 
                loading={isLoading} 
                style={styles.loginButton} 
              />

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  headerContainer: { alignItems: 'center', marginBottom: spacing.huge },
  logoContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: 'rgba(140, 140, 255, 0.1)',
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(140, 140, 255, 0.2)'
  },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.subtitle, color: colors.textSecondary },
  formContainer: { width: '100%' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    marginBottom: spacing.l,
    paddingHorizontal: spacing.l,
    height: 56
  },
  inputIcon: { marginRight: spacing.m },
  input: { flex: 1, color: colors.text, ...typography.body, height: '100%' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: spacing.xl },
  forgotPasswordText: { color: colors.textSecondary, ...typography.bodySmall },
  loginButton: { marginBottom: spacing.xl },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { color: colors.textSecondary, ...typography.body },
  registerLink: { color: colors.primary, ...typography.subtitle },
  errorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    padding: spacing.m, 
    borderRadius: radii.s, 
    marginBottom: spacing.l 
  },
  errorText: { color: colors.error, marginLeft: spacing.s, ...typography.bodySmall }
});
