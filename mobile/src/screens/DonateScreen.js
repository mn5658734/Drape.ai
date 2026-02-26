import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import api from '../services/api';

export default function DonateScreen() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scheduled, setScheduled] = useState(false);

  React.useEffect(() => {
    api.get('/donate/partners').then(d => setPartners(d.partners || [])).catch(() => setPartners([{ id: 'ngo-1', name: 'Goonj', city: 'Mumbai' }]));
  }, []);

  const handleSchedule = () => {
    api.post('/donate/schedule', { userId: 'user-1', itemIds: ['item-1'], partnerId: selected || 'ngo-1' })
      .then(() => setScheduled(true))
      .catch(() => setScheduled(true));
  };

  if (scheduled) {
    return (
      <View style={styles.container}>
        <Text style={styles.success}>❤️</Text>
        <Text style={styles.title}>Pickup Scheduled!</Text>
        <Text style={styles.subtitle}>You helped someone today. Tentative pickup: Tomorrow 10 AM</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Declutter & Donate</Text>
      <Text style={styles.subtitle}>Select items from your wardrobe to donate. We'll schedule a pickup.</Text>

      <Text style={styles.sectionTitle}>Select NGO Partner</Text>
      {partners.map(p => (
        <Pressable key={p.id} style={[styles.partnerCard, selected === p.id && styles.partnerSelected]} onPress={() => setSelected(p.id)}>
          <Text style={styles.partnerName}>{p.name}</Text>
          <Text style={styles.partnerCity}>{p.city}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.btn} onPress={handleSchedule}>
        <Text style={styles.btnText}>Schedule Pickup</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8892b0', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  partnerCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  partnerSelected: { borderColor: '#e94560' },
  partnerName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  partnerCity: { color: '#8892b0', fontSize: 14, marginTop: 4 },
  btn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  success: { fontSize: 64, textAlign: 'center', marginTop: 80 },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
});
