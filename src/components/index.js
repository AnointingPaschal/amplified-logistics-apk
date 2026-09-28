import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

export function Btn({ label, onPress, variant='primary', loading, icon, style }) {
  const bg = variant==='primary' ? COLORS.navy : variant==='orange' ? COLORS.orange : '#F3F4F6';
  const tc = variant==='outline' ? COLORS.navy : '#fff';
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.85}
      style={[{ backgroundColor: variant==='outline'?'#fff':bg, borderWidth: variant==='outline'?1.5:0, borderColor:COLORS.navy, borderRadius:RADIUS.full, overflow:'hidden' }, style]}>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:15, paddingHorizontal:24, gap:8 }}>
        {loading ? <ActivityIndicator color={tc} size="small" />
          : <>{icon && <Ionicons name={icon} size={18} color={tc}/>}<Text style={{ fontSize:15, fontWeight:FONTS.bold, color:tc }}>{label}</Text></>}
      </View>
    </TouchableOpacity>
  );
}

export function Input({ label, error, icon, ...props }) {
  return (
    <View style={{ marginBottom:16 }}>
      {label && <Text style={{ fontSize:11, fontWeight:FONTS.bold, color:COLORS.textMid, textTransform:'uppercase', letterSpacing:0.8, marginBottom:8 }}>{label}</Text>}
      <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:'#F8FAFC', borderWidth:1.5, borderColor:error?COLORS.red:COLORS.border, borderRadius:RADIUS.lg, paddingHorizontal:14, paddingVertical:Platform.OS==='ios'?14:2 }}>
        {icon && <Ionicons name={icon} size={18} color={COLORS.textLight} style={{ marginRight:8 }}/>}
        <TextInput style={{ flex:1, fontSize:15, color:COLORS.text, fontWeight:FONTS.medium }} placeholderTextColor={COLORS.textLight} {...props}/>
      </View>
      {error && <Text style={{ fontSize:11, color:COLORS.red, marginTop:4 }}>{error}</Text>}
    </View>
  );
}

export function Card({ children, style, onPress }) {
  const W = onPress ? TouchableOpacity : View;
  return <W style={[{ backgroundColor:COLORS.card, borderRadius:RADIUS.xl, padding:16, ...SHADOW.md, marginBottom:12 }, style]} onPress={onPress} activeOpacity={0.9}>{children}</W>;
}

export function Badge({ status }) {
  const map = { pending:{bg:'#FEF9C3',c:'#854D0E',l:'Pending'}, accepted:{bg:'#DBEAFE',c:'#1E40AF',l:'Accepted'}, pickup:{bg:'#EDE9FE',c:'#5B21B6',l:'Picked Up'}, transit:{bg:'#FEF3C7',c:'#92400E',l:'In Transit'}, delivered:{bg:'#DCFCE7',c:'#14532D',l:'Delivered'}, cancelled:{bg:'#FEE2E2',c:'#991B1B',l:'Cancelled'} };
  const s = map[status]||map.pending;
  return <View style={{ backgroundColor:s.bg, paddingHorizontal:10, paddingVertical:4, borderRadius:RADIUS.full }}><Text style={{ fontSize:11, fontWeight:FONTS.bold, color:s.c }}>{s.l}</Text></View>;
}

export function Row({ icon, label, value, onPress, danger }) {
  return (
    <TouchableOpacity style={{ flexDirection:'row', alignItems:'center', paddingVertical:14, borderBottomWidth:1, borderBottomColor:COLORS.border }} onPress={onPress} activeOpacity={0.7}>
      <View style={{ width:36, height:36, borderRadius:10, backgroundColor:danger?'#FEE2E2':'#F3F4F6', alignItems:'center', justifyContent:'center', marginRight:12 }}>
        <Ionicons name={icon} size={18} color={danger?COLORS.red:COLORS.navyMid}/>
      </View>
      <Text style={{ flex:1, fontSize:14, fontWeight:FONTS.semibold, color:danger?COLORS.red:COLORS.text }}>{label}</Text>
      {value && <Text style={{ fontSize:13, color:COLORS.textMid, marginRight:4 }}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={COLORS.textLight}/>
    </TouchableOpacity>
  );
}

export function Spinner({ color=COLORS.navy }) {
  return <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:40 }}><ActivityIndicator size="large" color={color}/></View>;
}

export function Empty({ icon, title, desc, action }) {
  return (
    <View style={{ alignItems:'center', justifyContent:'center', padding:48 }}>
      <Ionicons name={icon} size={56} color={COLORS.border}/>
      <Text style={{ fontSize:16, fontWeight:FONTS.bold, color:COLORS.text, marginTop:16, marginBottom:8 }}>{title}</Text>
      {desc && <Text style={{ fontSize:13, color:COLORS.textMid, textAlign:'center', lineHeight:20 }}>{desc}</Text>}
      {action}
    </View>
  );
}
