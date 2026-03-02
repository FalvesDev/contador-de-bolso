/**
 * Input de valor monetário com máscara
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  autoFocus?: boolean;
}

export function MoneyInput({ value, onChange, autoFocus = false }: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('0,00');

  useEffect(() => {
    // Formatar valor inicial
    setDisplayValue(formatCurrency(value));
  }, []);

  const formatCurrency = (val: number): string => {
    return val.toFixed(2).replace('.', ',');
  };

  const parseCurrency = (text: string): number => {
    // Remove tudo exceto números
    const numbers = text.replace(/\D/g, '');
    // Converte para centavos e depois para reais
    const cents = parseInt(numbers || '0', 10);
    return cents / 100;
  };

  const handleChangeText = (text: string) => {
    const numericValue = parseCurrency(text);
    setDisplayValue(formatCurrency(numericValue));
    onChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.currency}>R$</Text>
      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        autoFocus={autoFocus}
        selectTextOnFocus
        placeholder="0,00"
        placeholderTextColor={colors.gray[400]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
  currency: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.gray[400],
    marginRight: spacing[2],
  },
  input: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.gray[800],
    minWidth: 150,
    textAlign: 'center',
    padding: 0,
  },
});
