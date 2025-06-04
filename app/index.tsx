import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { loginUser } from '@/service/authService';
import { Colors } from '@/constants/Colors';

export default function TabLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.push('/(tabs)/prog');
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/invalid-email') {
        setErrorMessage("Adresse e-mail invalide. Veuillez réessayer.");
      } else {
        setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.content}>
        {/* Header Animation */}
        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          style={styles.header}
        >
          <IconSymbol 
            name="person.circle.fill" 
            size={100} 
            color={colors.accent} 
          />
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
        </Animated.View>

        {/* Affichage du message d'erreur */}
        {errorMessage ? (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        ) : null}

        {/* Form Animation */}
        <Animated.View 
          entering={FadeInUp.duration(1000).springify().delay(400)}
          style={styles.form}
        >
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.formContainer}
          >
            <View style={styles.inputContainer}>
              <IconSymbol 
                name="envelope.fill" 
                size={20} 
                color={colors.accent} 
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={colorScheme === 'dark' ? '#ffffff80' : '#00000080'}
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }
                ]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol 
                name="lock.fill" 
                size={20} 
                color={colors.accent} 
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={colorScheme === 'dark' ? '#ffffff80' : '#00000080'}
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }
                ]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => console.log('Forgot password')}
            >
              <ThemedText style={[styles.forgotPasswordText, { color: colors.accent }]}>Forgot Password?</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(onboarding)/register')}>
                <ThemedText style={[styles.signupLink, { color: colors.accent }]}>Sign Up</ThemedText>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  formContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.1)',
      android: 'rgba(255, 255, 255, 0.05)',
    }),
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    opacity: 0.7,
  },
  signupLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});
    