import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>👗</Text>
      <Text style={styles.title}>Drape.ai</Text>
      <Text style={styles.tagline}>Open App. Get Outfit. Step Out.</Text>
      <Pressable style={styles.skip} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 42, fontWeight: '700', color: '#fff', letterSpacing: 2 },
  tagline: { fontSize: 16, color: '#8892b0', marginTop: 8 },
  skip: { position: 'absolute', top: 48, right: 24 },
  skipText: { color: '#8892b0', fontSize: 14 },
});
