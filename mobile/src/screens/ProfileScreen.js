import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { user } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || 'Milan'}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone || '+91 98765 43210'}</Text>
      </View>

      <Pressable style={styles.menuItem}>
        <Text style={styles.menuText}>Edit Profile</Text>
        <Text style={styles.menuArrow}>→</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuText}>Style Preference</Text>
        <Text style={styles.menuArrow}>→</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuText}>Skin Tone Recalibration</Text>
        <Text style={styles.menuArrow}>→</Text>
      </Pressable>
      <Pressable style={styles.menuItem}>
        <Text style={styles.menuText}>Favourite Outfits</Text>
        <Text style={styles.menuArrow}>→</Text>
      </Pressable>
      <Pressable style={[styles.menuItem, styles.menuDisabled]}>
        <Text style={styles.menuText}>Payments</Text>
        <Text style={styles.badge}>Coming Soon</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 24 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 24 },
  label: { fontSize: 12, color: '#8892b0', marginTop: 12 },
  value: { fontSize: 16, color: '#fff', marginTop: 4 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a2e', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuText: { color: '#fff', fontSize: 16 },
  menuArrow: { color: '#8892b0' },
  menuDisabled: { opacity: 0.7 },
  badge: { color: '#e94560', fontSize: 12 },
});
