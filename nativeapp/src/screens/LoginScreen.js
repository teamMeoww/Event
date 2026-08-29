import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';


export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>EventOne.</Text>
              <LottieView
                source={require('../../assets/android-icon-monochrome.json')}
                autoPlay
                loop
                style={styles.logoAnimation}
              />
            </View>
            <Text style={styles.subtitle}>Sign in to your legacy account</Text>
          </View>
          
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={16} color="#FF3B30" style={{marginRight: 6}} />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#555555"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#555555"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 50,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoAnimation: {
    width: 150,
    height: 150,
    marginLeft: -15, // Negative margin to counteract the huge empty canvas space in the Lottie file
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#262626',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  forgotText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
