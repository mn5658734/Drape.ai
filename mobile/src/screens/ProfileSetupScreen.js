import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

const STYLES = ['casual', 'formal', 'ethnic', 'sporty', 'minimalist'];
const SKIN_TONES = ['fair', 'medium', 'olive', 'tan', 'brown', 'dark'];

export default function ProfileSetupScreen({ navigation }) {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState([]);
  const [skinTone, setSkinTone] = useState('');

  const toggleStyle = (s) => setStyle(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleComplete = () => {
    setUser({ ...user, name, gender, preferredStyle: style, skinTone, isProfileComplete: true });
    navigation.replace('WardrobeOnboarding');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete your profile</Text>
      <Text style={styles.subtitle}>Helps AI suggest better outfits</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#8892b0" value={name} onChangeText={setName} />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {['male', 'female', 'other'].map(g => (
          <Pressable key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Preferred style</Text>
      <View style={styles.rowWrap}>
        {STYLES.map(s => (
          <Pressable key={s} style={[styles.chip, style.includes(s) && styles.chipActive]} onPress={() => toggleStyle(s)}>
            <Text style={[styles.chipText, style.includes(s) && styles.chipTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Skin tone (optional)</Text>
      <View style={styles.rowWrap}>
        {SKIN_TONES.map(s => (
          <Pressable key={s} style={[styles.chip, skinTone === s && styles.chipActive]} onPress={() => setSkinTone(s)}>
            <Text style={[styles.chipText, skinTone === s && styles.chipTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.btn} onPress={handleComplete}>
        <Text style={styles.btnText}>Continue to Wardrobe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 24 },
  label: { fontSize: 14, color: '#8892b0', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1a1a2e' },
  chipActive: { backgroundColor: '#e94560' },
  chipText: { color: '#8892b0', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  btn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
