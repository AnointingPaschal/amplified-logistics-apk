import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Badge, Empty, Spinner } from '../../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../theme';

const TABS = ['All','Active','Delivered','Cancelled'];

export default function OrdersScreen({ navigation }) {
  const { orders, loading, fmt } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('All');

  const filtered = orders.filter(o=>{
    if(tab==='Active')    return ['pending','accepted','pickup','transit'].includes(o.status);
    if(tab==='Delivered') return o.status==='delivered';
    if(tab==='Cancelled') return o.status==='cancelled';
    return true;
  });

  const renderItem = ({item:o}) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}
      onPress={()=>navigation.navigate('TrackOrder',{order:o})}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <Text style={{fontSize:13,fontWeight:FONTS.bold,color:COLORS.navy}}>{o.tracking_id}</Text>
        <Badge status={o.status}/>
      </View>
      <View style={{marginBottom:14}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:6}}>
          <View style={{width:10,height:10,borderRadius:5,backgroundColor:COLORS.green}}/>
          <Text style={{flex:1,fontSize:13,color:COLORS.textMid}} numberOfLines={1}>{o.pickup_address}</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{width:10,height:10,borderRadius:5,backgroundColor:COLORS.red}}/>
          <Text style={{flex:1,fontSize:13,color:COLORS.textMid}} numberOfLines={1}>{o.dropoff_address}</Text>
        </View>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
        <Text style={{fontSize:12,color:COLORS.textLight}}>{new Date(o.created_at).toLocaleDateString('en-NG',{month:'short',day:'numeric'})}</Text>
        <Text style={{flex:1,fontSize:15,fontWeight:FONTS.black,color:COLORS.navy}}>{fmt(o.price)}</Text>
        {['pending','accepted','pickup','transit'].includes(o.status)&&(
          <View style={{backgroundColor:COLORS.navy,paddingHorizontal:14,paddingVertical:7,borderRadius:RADIUS.full}}>
            <Text style={{color:'#fff',fontSize:12,fontWeight:FONTS.bold}}>Track</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Ionicons name="search-outline" size={22} color={COLORS.navy}/>
      </View>
      <View style={styles.tabs}>
        {TABS.map(t=>(
          <TouchableOpacity key={t} style={[styles.tab,tab===t&&styles.tabActive]} onPress={()=>setTab(t)}>
            <Text style={[styles.tabText,tab===t&&{color:'#fff'}]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <Spinner/> : filtered.length===0 ? (
        <Empty icon="cube-outline" title="No orders yet" desc="Start shipping and your orders will appear here."
          action={<TouchableOpacity style={{marginTop:16,backgroundColor:COLORS.navy,paddingHorizontal:24,paddingVertical:12,borderRadius:RADIUS.full}} onPress={()=>navigation.navigate('Home')}><Text style={{color:'#fff',fontSize:14,fontWeight:FONTS.bold}}>Send a Package</Text></TouchableOpacity>}/>
      ) : (
        <FlatList data={filtered} keyExtractor={o=>o.id} renderItem={renderItem} contentContainerStyle={{padding:16}} showsVerticalScrollIndicator={false}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,backgroundColor:COLORS.bg},
  header:    {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:16,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:COLORS.border},
  title:     {fontSize:22,fontWeight:FONTS.black,color:COLORS.navy},
  tabs:      {flexDirection:'row',paddingHorizontal:16,paddingVertical:12,gap:8,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:COLORS.border},
  tab:       {paddingHorizontal:16,paddingVertical:7,borderRadius:RADIUS.full,backgroundColor:COLORS.bg},
  tabActive: {backgroundColor:COLORS.navy},
  tabText:   {fontSize:12,fontWeight:FONTS.semibold,color:COLORS.textMid},
  card:      {backgroundColor:'#fff',borderRadius:RADIUS.xl,padding:16,marginBottom:12,...SHADOW.md},
});
