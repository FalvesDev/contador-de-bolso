/**
 * Tela de Autenticação - Login e Registro
 * Design moderno estilo fintech
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { Text } from '../components/ui/Text';
import { WalletIcon, EyeIcon, EyeOffIcon } from '../components/ui/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AuthMode = 'login' | 'register';

interface AuthScreenProps {
  onOfflineMode?: () => void;
}

export function AuthScreen({ onOfflineMode }: AuthScreenProps) {
  const { theme } = useTheme();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (mode === 'register' && !name) {
      Alert.alert('Erro', 'Informe seu nome');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          const msg = error.message || '';
          if (msg.toLowerCase().includes('email not confirmed') || msg.toLowerCase().includes('not confirmed')) {
            Alert.alert(
              'Email não confirmado',
              'Verifique sua caixa de entrada e clique no link de confirmação antes de fazer login.',
              [{ text: 'OK' }]
            );
          } else if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials')) {
            Alert.alert('Erro', 'Email ou senha incorretos.');
          } else {
            Alert.alert('Erro', msg || 'Erro ao fazer login');
          }
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          Alert.alert('Erro', error.message || 'Erro ao criar conta');
        } else {
          Alert.alert(
            'Conta criada!',
            'Verifique seu email para confirmar o cadastro.',
            [{ text: 'OK', onPress: () => setMode('login') }]
          );
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header com gradiente */}
      <View style={styles.headerContainer}>
        <Svg width={SCREEN_WIDTH} height={280} style={styles.headerSvg}>
          <Defs>
            <LinearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.gradientStart} />
              <Stop offset="100%" stopColor={theme.colors.gradientEnd} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={280} fill="url(#authGrad)" />
          <Circle cx={SCREEN_WIDTH * 0.85} cy={50} r={100} fill="rgba(255,255,255,0.06)" />
          <Circle cx={SCREEN_WIDTH * 0.1} cy={180} r={60} fill="rgba(255,255,255,0.04)" />
        </Svg>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <WalletIcon size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.appName}>Contador de Bolso</Text>
          <Text style={styles.appTagline}>Suas finanças sob controle</Text>
        </View>
      </View>

      {/* Formulário */}
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Text>

          {mode === 'register' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Nome
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Seu nome"
                placeholderTextColor={theme.colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="seu@email.com"
              placeholderTextColor={theme.colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
              Senha
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Sua senha"
                placeholderTextColor={theme.colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} color={theme.colors.textTertiary} />
                ) : (
                  <EyeIcon size={20} color={theme.colors.textTertiary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchModeButton} onPress={toggleMode}>
            <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
              {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                {mode === 'login' ? 'Criar conta' : 'Fazer login'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modo offline */}
        <TouchableOpacity style={styles.offlineButton} onPress={onOfflineMode}>
          <Text style={[styles.offlineText, { color: theme.colors.textTertiary }]}>
            Continuar sem conta (modo offline)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 280,
  },
  headerSvg: {
    position: 'absolute',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  formScroll: {
    flex: 1,
    marginTop: -40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  submitButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 14,
  },
  offlineButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 13,
  },
});
