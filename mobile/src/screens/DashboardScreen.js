import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const OCCASIONS = [
  { key: 'office', label: 'Office' },
  { key: 'party', label: 'Party' },
  { key: 'dating', label: 'Dating' },
  { key: 'trip', label: 'Trip' },
  { key: 'casual_hangout', label: 'Casual' },
  { key: 'interview', label: 'Interview' },
];

export default function DashboardScreen({ navigation }) {
  const { user, selectedOccasion, setSelectedOccasion } = useApp();
  const [occasions, setOccasions] = useState(OCCASIONS);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    api.get('/weather?city=Mumbai').then(setWeather).catch(() => setWeather({ temperature: 24, condition: 'Sunny' }));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting()} {user?.name || 'Milan'} ☀️</Text>
        {weather && (
          <View style={styles.weather}>
            <Text style={styles.temp}>{weather.temperature}°C</Text>
            <Text style={styles.condition}>{weather.condition || 'Sunny'}</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.rushBtn} onPress={() => navigation.navigate('RushMode')}>
        <Text style={styles.rushText}>🔥 I'm Getting Late!</Text>
        <Text style={styles.rushSub}>AI picks best outfit in 3 sec</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>What's the Occasion?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.occasionScroll}>
        {occasions.map(o => (
          <Pressable
            key={o.key}
            style={[styles.occasionChip, selectedOccasion === o.key && styles.occasionChipActive]}
            onPress={() => setSelectedOccasion(o.key)}
          >
            <Text style={[styles.occasionText, selectedOccasion === o.key && styles.occasionTextActive]}>{o.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.swipeSection}>
        <Text style={styles.sectionTitle}>Outfit Suggestions</Text>
        <Pressable style={styles.swipeCard} onPress={() => navigation.navigate('OutfitSwipe')}>
          <Text style={styles.swipeEmoji}>👔</Text>
          <Text style={styles.swipeTitle}>Get outfit suggestions</Text>
          <Text style={styles.swipeSub}>Swipe to like or skip</Text>
        </Pressable>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Wardrobe')}>
          <Text style={styles.quickEmoji}>➕</Text>
          <Text style={styles.quickLabel}>Add Clothes</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Donate')}>
          <Text style={styles.quickEmoji}>♻️</Text>
          <Text style={styles.quickLabel}>Declutter</Text>
        </Pressable>
        <Pressable style={styles.quickBtn}>
          <Text style={styles.quickEmoji}>❤️</Text>
          <Text style={styles.quickLabel}>Favorites</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '600', color: '#fff' },
  weather: { backgroundColor: '#1a1a2e', padding: 12, borderRadius: 12 },
  temp: { fontSize: 18, fontWeight: '700', color: '#fff' },
  condition: { fontSize: 12, color: '#8892b0' },
  rushBtn: { backgroundColor: '#e94560', borderRadius: 16, padding: 20, marginBottom: 24 },
  rushText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  rushSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  occasionScroll: { marginBottom: 24, marginHorizontal: -24, paddingHorizontal: 24 },
  occasionChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#1a1a2e', marginRight: 8 },
  occasionChipActive: { backgroundColor: '#e94560' },
  occasionText: { color: '#8892b0', fontSize: 14 },
  occasionTextActive: { color: '#fff' },
  swipeSection: { marginBottom: 24 },
  swipeCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 2, borderColor: '#16213e' },
  swipeEmoji: { fontSize: 48, marginBottom: 8 },
  swipeTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  swipeSub: { fontSize: 14, color: '#8892b0', marginTop: 4 },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickBtn: { flex: 1, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, alignItems: 'center' },
  quickEmoji: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: 12, color: '#8892b0' },
});
