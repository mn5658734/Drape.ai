import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const SUGGESTED_TAGS = ['Office', 'Date night', 'Weekend', 'Travel', 'Party', 'Casual', 'Formal', 'Summer', 'Winter'];

export default function OutfitSwipeScreen({ navigation }) {
  const { user, selectedOccasion } = useApp();
  const [outfits, setOutfits] = useState([]);
  const [current, setCurrent] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);

  useEffect(() => {
    api.get(`/outfits/user-1/suggestions?occasion=${selectedOccasion || 'office'}`)
      .then(d => setOutfits(d.outfits || []))
      .catch(() => setOutfits([{ id: '1', aiExplanation: 'Blue shirt + navy pants. Professional look.', itemIds: [] }]));
  }, [selectedOccasion]);

  const outfit = outfits[current];

  const handleLike = () => {
    if (outfit) api.post(`/outfits/user-1/${outfit.id}/action`, { action: 'like' });
    setCurrent(prev => prev + 1);
    if (current >= outfits.length - 1) navigation.goBack();
  };
  const handleSkip = () => {
    if (outfit) api.post(`/outfits/user-1/${outfit.id}/action`, { action: 'skip' });
    setCurrent(prev => prev + 1);
    if (current >= outfits.length - 1) navigation.goBack();
  };
  const handleSave = () => {
    if (outfit) api.post(`/outfits/user-1/${outfit.id}/action`, { action: 'save' });
    setCurrent(prev => prev + 1);
    if (current >= outfits.length - 1) navigation.goBack();
  };

  if (!outfit) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuBtnText}>⋮</Text>
        </Pressable>
        <Pressable style={styles.shopBtn} onPress={() => navigation.navigate('ShoppingRecommendations', { outfitId: outfit.id, occasion: selectedOccasion })}>
          <Text style={styles.shopBtnText}>🛍 Shop similar</Text>
        </Pressable>
        <Image source={{ uri: 'https://picsum.photos/seed/outfit/400/500' }} style={styles.img} />
        <View style={styles.overlay}>
          <Text style={styles.explanation}>{outfit.aiExplanation}</Text>
          {outfit.tags?.length > 0 && (
            <View style={styles.tagRow}>
              {outfit.tags.map(t => <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>)}
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.skipBtn]} onPress={handleSkip}>
          <Text style={styles.actionEmoji}>👎</Text>
          <Text style={styles.actionLabel}>Skip</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.saveBtn]} onPress={() => setMenuVisible(true)}>
          <Text style={styles.actionEmoji}>🔁</Text>
          <Text style={styles.actionLabel}>Save</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.likeBtn]} onPress={handleLike}>
          <Text style={styles.actionEmoji}>❤️</Text>
          <Text style={styles.actionLabel}>Like</Text>
        </Pressable>
      </View>

      <Text style={styles.counter}>{current + 1} / {outfits.length}</Text>

      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Save for later</Text>
            <Pressable style={styles.menuItem} onPress={handleSaveForLater}>
              <Text style={styles.menuItemEmoji}>📌</Text>
              <Text style={styles.menuItemText}>Save for later</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setTagModalVisible(true); }}>
              <Text style={styles.menuItemEmoji}>🏷️</Text>
              <Text style={styles.menuItemText}>Tag & save</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => setCollectionModalVisible(true)}>
              <Text style={styles.menuItemEmoji}>📁</Text>
              <Text style={styles.menuItemText}>Save to collection</Text>
            </Pressable>
            <Pressable style={styles.menuCancel} onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={tagModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.tagModal}>
            <Text style={styles.modalTitle}>Add tags</Text>
            <ScrollView style={styles.tagList} horizontal showsHorizontalScrollIndicator={false}>
              {SUGGESTED_TAGS.map(t => (
                <Pressable key={t} style={[styles.tagChip, selectedTags.includes(t) && styles.tagChipActive]} onPress={() => toggleTag(t)}>
                  <Text style={[styles.tagChipText, selectedTags.includes(t) && styles.tagChipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <TextInput
              style={styles.tagInput}
              placeholder="Custom tag..."
              placeholderTextColor="#8892b0"
              value={customTag}
              onChangeText={setCustomTag}
            />
            <Pressable style={styles.modalBtn} onPress={handleTagAndSave}>
              <Text style={styles.modalBtnText}>Save with tags</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={collectionModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.collectionModal}>
            <Text style={styles.modalTitle}>Save to collection</Text>
            <ScrollView style={styles.collectionList}>
              {collections.map(c => (
                <Pressable key={c.id} style={styles.collectionItem} onPress={() => handleSaveToCollection(c.id)}>
                  <Text style={styles.collectionIcon}>{c.icon === 'briefcase' ? '💼' : c.icon === 'sun' ? '☀️' : c.icon === 'heart' ? '❤️' : c.icon === 'plane' ? '✈️' : '📁'}</Text>
                  <Text style={styles.collectionName}>{c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {showNewCollection ? (
              <View style={styles.newCollectionRow}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Collection name"
                  placeholderTextColor="#8892b0"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                />
                <Pressable style={styles.modalBtn} onPress={handleCreateAndSave}>
                  <Text style={styles.modalBtnText}>Create & Save</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addCollectionBtn} onPress={() => setShowNewCollection(true)}>
                <Text style={styles.addCollectionText}>+ New collection</Text>
              </Pressable>
            )}
            <Pressable style={styles.modalCancel} onPress={() => { setCollectionModalVisible(false); setShowNewCollection(false); setNewCollectionName(''); }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 24, justifyContent: 'center' },
  loading: { color: '#fff', textAlign: 'center' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 20, overflow: 'hidden', marginBottom: 24, position: 'relative' },
  menuBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  menuBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  shopBtn: { position: 'absolute', top: 12, left: 12, zIndex: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  shopBtnText: { color: '#fff', fontSize: 14 },
  img: { width: '100%', height: 400, backgroundColor: '#16213e' },
  overlay: { padding: 16 },
  explanation: { color: '#8892b0', fontSize: 14 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { backgroundColor: '#16213e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#e94560', fontSize: 12 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  actionBtn: { alignItems: 'center', padding: 12 },
  skipBtn: {},
  saveBtn: {},
  likeBtn: {},
  actionEmoji: { fontSize: 32, marginBottom: 4 },
  actionLabel: { color: '#8892b0', fontSize: 12 },
  counter: { color: '#8892b0', textAlign: 'center', marginTop: 24, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', padding: 24 },
  menuCard: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20 },
  menuTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#16213e', marginBottom: 8 },
  menuItemEmoji: { fontSize: 20, marginRight: 12 },
  menuItemText: { color: '#fff', fontSize: 16 },
  menuCancel: { marginTop: 12, alignItems: 'center', padding: 12 },
  menuCancelText: { color: '#8892b0', fontSize: 16 },
  tagModal: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20, maxHeight: 320 },
  collectionModal: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20, maxHeight: 400 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  tagList: { marginBottom: 16, maxHeight: 44 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#16213e', marginRight: 8 },
  tagChipActive: { backgroundColor: '#e94560' },
  tagChipText: { color: '#8892b0', fontSize: 14 },
  tagChipTextActive: { color: '#fff' },
  tagInput: { backgroundColor: '#16213e', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16, marginBottom: 16 },
  modalBtn: { backgroundColor: '#e94560', borderRadius: 12, padding: 16, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  collectionList: { maxHeight: 240, marginBottom: 16 },
  collectionItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#16213e', marginBottom: 8 },
  collectionIcon: { fontSize: 24, marginRight: 12 },
  collectionName: { color: '#fff', fontSize: 16 },
  newCollectionRow: { marginBottom: 12 },
  addCollectionBtn: { padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#e94560', borderStyle: 'dashed', alignItems: 'center', marginBottom: 12 },
  addCollectionText: { color: '#e94560', fontSize: 16 },
  modalCancel: { alignItems: 'center', padding: 12 },
  modalCancelText: { color: '#8892b0', fontSize: 16 },
});
