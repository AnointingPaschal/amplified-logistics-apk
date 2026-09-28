import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { Row } from '../../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../theme';

export default function ProfileScreen({ navigation }) {
  const { user, wallet, orders, logout, fmt } = useApp();
  const insets = useSafeAreaInsets();
  const initials = (user?.user_metadata?.name||user?.email||'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const delivered = orders.filter(o=>o.status==='delivered').length;

  const handleLogout = () => Alert.alert('Log Out','Are you sure?',[
    {text:'Cancel',style:'cancel'},
    {text:'Log Out',style:'destructive',onPress:logout},
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[COLORS.navy,'#0d2137']} style={[styles.header,{paddingTop:insets.top+16}]}>
        <View style={{alignItems:'center'}}>
          <View style={styles.avatar}>
            <Text style={{fontSize:30,fontWeight:FONTS.black,color:'#fff'}}>{initials}</Text>
          </View>
          <Text style={{fontSize:22,fontWeight:FONTS.black,color:'#fff',marginBottom:4,marginTop:14}}>{user?.user_metadata?.name||'User'}</Text>
          <Text style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:24}}>{user?.email}</Text>
          <View style={{flexDirection:'row',gap:20}}>
            {[['Orders',orders.length],['Delivered',delivered],['Balance',fmt(wallet?.balance||0)]].map(([l,v])=>(
              <View key={l} style={{alignItems:'center',backgroundColor:'rgba(255,255,255,0.1)',borderRadius:14,paddingHorizontal:18,paddingVertical:10}}>
                <Text style={{fontSize:18,fontWeight:FONTS.black,color:'#fff'}}>{v}</Text>
                <Text style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:2}}>{l}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={{padding:20}}>
        {[
          {title:'Account',items:[
            {icon:'wallet-outline',label:'Wallet',value:fmt(wallet?.balance||0),onPress:()=>navigation.navigate('Wallet')},
            {icon:'location-outline',label:'Address Book',onPress:()=>{}},
            {icon:'notifications-outline',label:'Notifications',onPress:()=>{}},
            {icon:'shield-checkmark-outline',label:'Privacy & Security',onPress:()=>{}},
          ]},
          {title:'Rewards',items:[
            {icon:'gift-outline',label:'Refer & Earn',value:'₦500/friend',onPress:()=>{}},
            {icon:'pricetag-outline',label:'Promo Codes',onPress:()=>{}},
          ]},
          {title:'Support',items:[
            {icon:'headset-outline',label:'Help Center',onPress:()=>{}},
            {icon:'document-text-outline',label:'Order Disputes',onPress:()=>{}},
          ]},
        ].map(sec=>(
          <View key={sec.title} style={{marginBottom:16}}>
            <Text style={{fontSize:11,fontWeight:FONTS.black,color:COLORS.textMid,textTransform:'uppercase',letterSpacing:0.8,marginBottom:10}}>{sec.title}</Text>
            <View style={{backgroundColor:'#fff',borderRadius:RADIUS.xl,paddingHorizontal:16,...SHADOW.sm}}>
              {sec.items.map(item=><Row key={item.label} {...item}/>)}
            </View>
          </View>
        ))}

        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,backgroundColor:'#FEE2E2',borderRadius:RADIUS.full,paddingVertical:14,marginTop:8,marginBottom:12}} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.red}/>
          <Text style={{fontSize:15,fontWeight:FONTS.bold,color:COLORS.red}}>Log Out</Text>
        </TouchableOpacity>
        <Text style={{textAlign:'center',fontSize:11,color:COLORS.textLight,marginBottom:32}}>Amplified Logistics v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,backgroundColor:COLORS.bg},
  header:    {paddingHorizontal:24,paddingBottom:28},
  avatar:    {width:80,height:80,borderRadius:24,backgroundColor:'rgba(255,255,255,0.18)',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'rgba(255,255,255,0.25)'},
});
