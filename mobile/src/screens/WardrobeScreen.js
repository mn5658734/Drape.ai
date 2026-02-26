import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import api from '../services/api';

export default function WardrobeScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/wardrobe/user-1').then(d => setItems(d.items || [])).catch(() => setItems([]));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Wardrobe</Text>
      <Text style={styles.subtitle}>{items.length} items</Text>

      <Pressable style={styles.addBtn}>
        <Text style={styles.addText}>+ Add Clothes</Text>
      </Pressable>

      <View style={styles.grid}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.tags}>{item.tags?.join(', ') || '—'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 24 },
  addBtn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  addText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: '#1a1a2e', borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: 140, backgroundColor: '#16213e' },
  category: { padding: 8, color: '#fff', fontSize: 14 },
  tags: { paddingHorizontal: 8, paddingBottom: 8, color: '#8892b0', fontSize: 12 },
});
