import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0;
  }, [username, password]);

  function onSubmit() {
    if (!canSubmit) return;
    // TODO: call real login API here
    router.replace('/(tabs)/HomePage');
  }

  return (
    <View style={styles.container}>
      {/* Background circles */}
      <View style={[styles.circle, styles.circleOne]} />
      <View style={[styles.circle, styles.circleTwo]} />
      <View style={[styles.circle, styles.circleThree]} />
      <View style={[styles.circle, styles.circleFour]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Brand Section */}
        <View style={styles.brandContainer}>
          <Image source={require('../../assets/images/echoTempLogo.png')} resizeMode='contain' style={{ width: 175, height: 175 }} />

          <Text style={styles.brandTagline}>Keep their memory alive</Text>
        </View>

        {/* Login card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your journey</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#B8B8B8"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#B8B8B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !canSubmit && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={onSubmit}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.signupLinkText}>
              Don&apos;t have an account? <Text style={styles.signupLinkBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support footer */}
        <TouchableOpacity style={styles.supportContainer}>
          <Text style={styles.supportText}>Need help? Contact support</Text>
        </TouchableOpacity>

        {/* Extra padding at bottom */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F1E9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: height,
  },

  // Background circles
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  circleOne: {
    width: 280,
    height: 280,
    top: -100,
    left: -80,
    backgroundColor: '#E8C07D',
  },
  circleTwo: {
    width: 350,
    height: 350,
    bottom: -140,
    right: -120,
    backgroundColor: '#B7A9C9',
  },
  circleThree: {
    width: 200,
    height: 200,
    top: height * 0.35,
    right: -70,
    backgroundColor: '#E6AFA4',
    opacity: 0.1,
  },
  circleFour: {
    width: 160,
    height: 160,
    bottom: height * 0.3,
    left: -50,
    backgroundColor: '#F2C6C2',
    opacity: 0.12,
  },

  // Brand section
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6AFA4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#E6AFA4',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
  },
  brandName: {
    fontSize: 40,
    fontWeight: '700',
    color: '#B7A9C9',
    letterSpacing: 1,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 14,
    color: '#B7A9C9',
    opacity: 0.65,
    letterSpacing: 0.3,
    fontStyle: 'italic',
  },

  // Card
  card: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#B7A9C9',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(183, 169, 201, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F2C6C2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#B7A9C9',
    marginBottom: 28,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Input fields
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    color: '#2C2C2E',
  },

  // Forgot password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#E6AFA4',
    fontWeight: '600',
  },

  // Button
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#E6AFA4',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#E6AFA4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#B8B8B8',
    fontWeight: '500',
  },

  // Signup link
  signupLink: {
    paddingVertical: 8,
  },
  signupLinkText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  signupLinkBold: {
    fontWeight: '600',
    color: '#E6AFA4',
  },

  // Support
  supportContainer: {
    marginTop: 24,
    paddingVertical: 8,
  },
  supportText: {
    fontSize: 13,
    color: '#B7A9C9',
    opacity: 0.6,
  },

  // Bottom padding
  bottomPadding: {
    height: 40,
  },
});

export default LoginScreen;