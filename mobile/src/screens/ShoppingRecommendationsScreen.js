import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, Linking, StyleSheet } from 'react-native';
import api from '../services/api';

export default function ShoppingRecommendationsScreen({ route, navigation }) {
  const { outfitId, occasion } = route.params || {};
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/shopping/recommendations?outfitId=${outfitId || ''}&occasion=${occasion || ''}`)
      .then(d => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, [outfitId, occasion]);

  const openUrl = (url) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>🛍 Shopping Recommendations</Text>
      <Text style={styles.subtitle}>Similar products from our partner stores</Text>

      {products.map(p => (
        <Pressable key={p.id} style={styles.card} onPress={() => openUrl(p.url)}>
          <Image source={{ uri: p.image }} style={styles.img} />
          <View style={styles.cardBody}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.brand}>{p.brand}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{p.price}</Text>
              {p.originalPrice && <Text style={styles.originalPrice}>{p.originalPrice}</Text>}
            </View>
            <View style={styles.meta}>
              <Text style={styles.platform}>{p.platform}</Text>
              {p.rating && <Text style={styles.rating}>★ {p.rating}</Text>}
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      ))}

      <Text style={styles.disclaimer}>Affiliate links. We may earn a commission when you make a purchase.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  back: { marginBottom: 16 },
  backText: { color: '#8892b0', fontSize: 14 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 12, padding: 12, marginBottom: 12 },
  img: { width: 80, height: 100, borderRadius: 8, backgroundColor: '#16213e' },
  cardBody: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  brand: { fontSize: 14, color: '#8892b0', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '600', color: '#e94560' },
  originalPrice: { fontSize: 12, color: '#8892b0', textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  platform: { fontSize: 12, backgroundColor: '#16213e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: '#8892b0' },
  rating: { fontSize: 12, color: '#8892b0' },
  arrow: { color: '#e94560', fontSize: 18 },
  disclaimer: { marginTop: 24, fontSize: 12, color: '#8892b0', textAlign: 'center' },
});
