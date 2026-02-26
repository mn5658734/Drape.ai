import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import api from '../services/api';

export default function RushModeScreen({ navigation }) {
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/outfits/user-1/rush-mode')
      .then(d => { setOutfit(d.outfit); setLoading(false); })
      .catch(() => { setOutfit({ aiExplanation: 'Blue shirt + navy pants. Quick & professional!' }); setLoading(false); });
  }, []);

  if (loading) return <View style={styles.container}><Text style={styles.loading}>Picking your outfit...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your outfit is ready! 🎉</Text>
      <View style={styles.card}>
        <Image source={{ uri: 'https://picsum.photos/seed/rush/400/500' }} style={styles.img} />
        <Text style={styles.explanation}>{outfit?.aiExplanation}</Text>
      </View>
      <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Got it, stepping out!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 24, justifyContent: 'center' },
  loading: { color: '#fff', textAlign: 'center', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 24 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  img: { width: '100%', height: 350, backgroundColor: '#16213e' },
  explanation: { padding: 16, color: '#8892b0', fontSize: 14 },
  btn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
