import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import LeafletMap from '../../components/LeafletMap';
import { COLORS, FONTS, SHADOW } from '../../theme';

const SERVICES = [
  {
    id: 'standard', icon: 'bicycle', bg: ['#F97316','#EA580C'],
    title: 'Standard Packages', desc: 'Lightweight items up to 5kg',
    eta: '20–40 min', price: '₦2,500', limit: 'Max 3 Stops',
  },
  {
    id: 'bulk', icon: 'layers', bg: ['#D97706','#92400E'],
    title: 'Bulk Packages', desc: 'Fixed price for 4+ locations',
    eta: '1–3 hrs', price: '₦8,500',
  },
  {
    id: 'heavy', icon: 'car', bg: ['#1E3A5F','#0A1628'],
    title: 'Heavy & Relocation', desc: 'Furniture, big loads & home moves',
    eta: 'Same day', price: '₦25,000',
  },
];

export default function HomeScreen({ navigation }) {
  const { user, wallet, fmt } = useApp();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);

  const name = user?.user_metadata?.name || 'Guest User';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const SHEET_HEIGHT = expanded ? '70%' : '42%';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Live OpenStreetMap */}
      <View style={StyleSheet.absoluteFill}>
        <LeafletMap height="100%" showUserLocation />
      </View>

      {/* Top gradient */}
      <LinearGradient
        colors={['rgba(10,22,40,0.97)', 'rgba(10,22,40,0.82)', 'rgba(10,22,40,0.0)']}
        style={[styles.topBar, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')} activeOpacity={0.85}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greetText}>Good Morning</Text>
            <Text style={styles.nameText}>{name}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('CreateOrder', { type: 'standard' })}
          activeOpacity={0.9}
        >
          <View style={styles.searchLeft}>
            <Ionicons name="search-outline" size={17} color={COLORS.textLight} />
            <Text style={styles.searchText}>Where are we delivering?</Text>
          </View>
          <View style={styles.navBtn}>
            <Ionicons name="navigate" size={15} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Wallet card */}
      <TouchableOpacity
        style={[styles.walletCard, { top: insets.top + 148 }]}
        onPress={() => navigation.navigate('Wallet')}
        activeOpacity={0.92}
      >
        <View style={styles.walletIcon}>
          <Ionicons name="wallet" size={17} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.walletLabel}>Amplified Wallet</Text>
          <Text style={styles.walletBal}>{fmt(wallet?.balance || 0)}</Text>
        </View>
        <View style={styles.fundBtn}>
          <Ionicons name="add" size={14} color="#fff" />
          <Text style={styles.fundText}>{user ? 'Fund' : 'Activate'}</Text>
        </View>
      </TouchableOpacity>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { height: SHEET_HEIGHT }]}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.handleWrap} activeOpacity={0.7}>
          <View style={styles.handle} />
          <Ionicons name={expanded ? 'chevron-down' : 'chevron-up'} size={15} color="#C4C9D4" style={{ marginTop: 2 }} />
        </TouchableOpacity>

        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>Ship a Package</Text>
            <Text style={styles.sheetSub}>Choose a delivery type below</Text>
          </View>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Riders online</Text>
          </View>
        </View>

        {/* Services — no ScrollView needed, just 3 items */}
        <View style={{ flex: 1 }}>
          {SERVICES.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.serviceRow, i < SERVICES.length - 1 && styles.rowBorder]}
              onPress={() => navigation.navigate('CreateOrder', { type: s.id })}
              activeOpacity={0.75}
            >
              <LinearGradient colors={s.bg} style={styles.serviceIconBox}>
                <Ionicons name={s.icon} size={24} color="#fff" />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <Text style={styles.serviceName}>{s.title}</Text>
                  {s.limit && (
                    <View style={styles.limitBadge}>
                      <Text style={styles.limitText}>{s.limit}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.serviceDesc}>{s.desc}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={11} color={COLORS.textLight} />
                  <Text style={styles.etaText}>{s.eta}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.priceText}>from {s.price}</Text>
                </View>
              </View>

              <View style={styles.arrowBox}>
                <Ionicons name="chevron-forward" size={18} color={COLORS.navy} />
              </View>
            </TouchableOpacity>
          ))}

          {!user && (
            <View style={styles.guestCard}>
              <LinearGradient colors={[COLORS.navy, '#1a3a6b']} style={styles.guestGrad}>
                <View style={styles.guestIconBox}>
                  <Ionicons name="log-in-outline" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guestTitle}>Login to track & manage orders</Text>
                  <Text style={styles.guestSub}>Create an account in 30 seconds</Text>
                </View>
                <TouchableOpacity style={styles.guestBtn} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.guestBtnText}>Login</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.navy },
  topBar:       { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 16, paddingBottom: 18 },
  topRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar:       { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.28)', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { color: '#fff', fontSize: 15, fontWeight: FONTS.black },
  greetText:    { color: 'rgba(255,255,255,0.48)', fontSize: 11 },
  nameText:     { color: '#fff', fontSize: 16, fontWeight: FONTS.bold },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  searchBar:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, paddingLeft: 14, paddingRight: 6, paddingVertical: 8, ...SHADOW.lg },
  searchLeft:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchText:   { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  navBtn:       { width: 36, height: 36, borderRadius: 14, backgroundColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
  walletCard:   { position: 'absolute', left: 14, right: 14, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 20, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  walletIcon:   { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
  walletLabel:  { fontSize: 11, color: COLORS.textMid },
  walletBal:    { fontSize: 15, fontWeight: FONTS.black, color: COLORS.navy, marginTop: 1 },
  fundBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  fundText:     { color: '#fff', fontSize: 12, fontWeight: FONTS.bold },
  sheet:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, ...SHADOW.lg },
  handleWrap:   { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle:       { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDE1E8', marginBottom: 2 },
  sheetHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  sheetTitle:   { fontSize: 19, fontWeight: FONTS.black, color: COLORS.navy },
  sheetSub:     { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  activeBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  activeDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: '#16A34A' },
  activeText:   { fontSize: 11, fontWeight: FONTS.bold, color: '#16A34A' },
  serviceRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 14 },
  rowBorder:    { borderBottomWidth: 1, borderBottomColor: '#F1F3F7' },
  serviceIconBox:{ width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm },
  serviceName:  { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.navy },
  limitBadge:   { backgroundColor: '#FEF3C7', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  limitText:    { fontSize: 9, fontWeight: FONTS.bold, color: '#92400E' },
  serviceDesc:  { fontSize: 12, color: COLORS.textMid, marginBottom: 5 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etaText:      { fontSize: 11, color: COLORS.textLight },
  metaDot:      { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.textLight },
  priceText:    { fontSize: 11, fontWeight: FONTS.bold, color: COLORS.navyMid },
  arrowBox:     { width: 34, height: 34, borderRadius: 11, backgroundColor: '#F0F4FF', alignItems: 'center', justifyContent: 'center' },
  guestCard:    { margin: 16, borderRadius: 20, overflow: 'hidden' },
  guestGrad:    { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  guestIconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  guestTitle:   { color: '#fff', fontSize: 13, fontWeight: FONTS.bold },
  guestSub:     { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 },
  guestBtn:     { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  guestBtnText: { color: COLORS.navy, fontSize: 12, fontWeight: FONTS.black },
});
