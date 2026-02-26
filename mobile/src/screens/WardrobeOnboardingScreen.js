import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

const MOCK_ITEMS = [
  { id: '1', category: 'Shirt', image: 'https://picsum.photos/seed/s1/200/250' },
  { id: '2', category: 'Pants', image: 'https://picsum.photos/seed/p1/200/250' },
  { id: '3', category: 'T-shirt', image: 'https://picsum.photos/seed/t1/200/250' },
  { id: '4', category: 'Jeans', image: 'https://picsum.photos/seed/j1/200/250' },
];

export default function WardrobeOnboardingScreen({ navigation }) {
  const { user } = useApp();
  const [items, setItems] = useState(MOCK_ITEMS);

  const handleAddMore = () => setItems(prev => [...prev, { id: Date.now(), category: 'New', image: 'https://picsum.photos/200/250' }]);
  const handleDone = () => navigation.replace('Main');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Build your digital wardrobe</Text>
      <Text style={styles.subtitle}>Upload photos of your clothes. AI will categorize them.</Text>

      <View style={styles.grid}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <Text style={styles.category}>{item.category}</Text>
          </View>
        ))}
        <Pressable style={styles.addCard} onPress={handleAddMore}>
          <Text style={styles.addText}>+ Add</Text>
        </Pressable>
      </View>

      <Pressable style={styles.btn} onPress={handleDone}>
        <Text style={styles.btnText}>Done – Go to Dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: '#1a1a2e', borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: 120, backgroundColor: '#16213e' },
  category: { padding: 8, color: '#fff', fontSize: 12 },
  addCard: { width: '47%', height: 140, backgroundColor: '#16213e', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e94560', borderStyle: 'dashed' },
  addText: { color: '#e94560', fontSize: 18 },
  btn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
