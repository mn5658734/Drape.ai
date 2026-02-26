import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { setUser } = useApp();
  const [phone, setPhone] = useState('+919876543210');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');

  const handleSendOtp = () => setStep('otp');
  const handleVerify = () => {
    setUser({ id: 'user-1', phone, name: name.trim() || 'User', isProfileComplete: false });
    navigation.replace('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Drape.ai</Text>
      <Text style={styles.subtitle}>Sign in with your phone number</Text>

      {step === 'phone' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 43210"
            placeholderTextColor="#8892b0"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Pressable style={styles.btn} onPress={handleSendOtp}>
            <Text style={styles.btnText}>Send OTP</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#8892b0"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit OTP"
            placeholderTextColor="#8892b0"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
          />
          <Pressable style={styles.btn} onPress={handleVerify}>
            <Text style={styles.btnText}>Verify & Continue</Text>
          </Pressable>
          <Pressable onPress={() => setStep('phone')}>
            <Text style={styles.link}>Change number</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 32 },
  input: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16 },
  btn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#e94560', textAlign: 'center', fontSize: 14 },
});
