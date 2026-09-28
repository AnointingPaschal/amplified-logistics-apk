import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { Btn } from '../../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../theme';

const AMOUNTS = [1000,2000,5000,10000,20000,50000];

export default function WalletScreen({ navigation }) {
  const { wallet, fmt, showToast, setWallet } = useApp();
  const insets = useSafeAreaInsets();
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    const n = Number(amount);
    if (!n||n<100) { showToast('Enter valid amount','error'); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    setWallet(w=>({...w,balance:(w?.balance||0)+n}));
    setModal(false); setAmount('');
    showToast(`₦${n.toLocaleString()} added!`,'success');
    setLoading(false);
  };

  return (
    <View style={[styles.container,{paddingTop:insets.top}]}>
      <StatusBar style="light"/>
      <LinearGradient colors={[COLORS.navy,'#0d2137']} style={styles.balCard}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:20}}>
          <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.7)"/>
        </TouchableOpacity>
        <Text style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:6}}>Available Balance</Text>
        <Text style={{fontSize:40,fontWeight:FONTS.black,color:'#fff',marginBottom:24}}>{fmt(wallet?.balance||0)}</Text>
        <View style={{flexDirection:'row',gap:12}}>
          <TouchableOpacity style={styles.balBtn} onPress={()=>setModal(true)}>
            <Ionicons name="add" size={18} color={COLORS.navy}/>
            <Text style={{fontSize:14,fontWeight:FONTS.bold,color:COLORS.navy}}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.balBtn,{backgroundColor:'rgba(255,255,255,0.15)'}]} onPress={()=>showToast('Withdrawal coming soon','info')}>
            <Ionicons name="arrow-up" size={18} color="#fff"/>
            <Text style={{fontSize:14,fontWeight:FONTS.bold,color:'#fff'}}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{padding:16}}>
        <TouchableOpacity style={styles.referralCard}>
          <View style={{width:44,height:44,borderRadius:13,backgroundColor:'#FEF3C7',alignItems:'center',justifyContent:'center'}}>
            <Ionicons name="gift-outline" size={22} color={COLORS.amber}/>
          </View>
          <View style={{flex:1}}>
            <Text style={{fontSize:14,fontWeight:FONTS.bold,color:'#92400E'}}>Earn ₦500 per referral!</Text>
            <Text style={{fontSize:12,color:'#B45309',marginTop:2}}>Invite friends and both get rewarded</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.amber}/>
        </TouchableOpacity>

        <Text style={{fontSize:14,fontWeight:FONTS.bold,color:COLORS.navy,marginBottom:12}}>Transaction History</Text>
        <View style={{alignItems:'center',padding:40}}>
          <Ionicons name="receipt-outline" size={48} color={COLORS.border}/>
          <Text style={{fontSize:14,color:COLORS.textLight,marginTop:12}}>No transactions yet</Text>
        </View>
      </ScrollView>

      <Modal visible={modal} animationType="slide" transparent>
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}} onPress={()=>setModal(false)}/>
        <View style={styles.modalSheet}>
          <View style={{alignItems:'center',marginBottom:20}}><View style={{width:36,height:4,borderRadius:2,backgroundColor:'#D1D5DB'}}/></View>
          <Text style={{fontSize:20,fontWeight:FONTS.black,color:COLORS.navy,marginBottom:20}}>Add Money</Text>
          <Text style={styles.qLabel}>Quick Amounts</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20}}>
            {AMOUNTS.map(a=>(
              <TouchableOpacity key={a} style={[styles.qChip,amount===String(a)&&{backgroundColor:COLORS.navy,borderColor:COLORS.navy}]} onPress={()=>setAmount(String(a))}>
                <Text style={[{fontSize:13,fontWeight:FONTS.semibold,color:COLORS.textMid},amount===String(a)&&{color:'#fff'}]}>{fmt(a)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.qLabel}>Custom Amount</Text>
          <View style={{flexDirection:'row',alignItems:'center',borderWidth:1.5,borderColor:COLORS.border,borderRadius:RADIUS.lg,paddingHorizontal:14,paddingVertical:12,marginBottom:20}}>
            <Text style={{fontSize:20,fontWeight:FONTS.bold,color:COLORS.textMid,marginRight:4}}>₦</Text>
            <TextInput value={amount} onChangeText={setAmount} placeholder="0" keyboardType="numeric"
              style={{flex:1,fontSize:24,fontWeight:FONTS.black,color:COLORS.navy}} placeholderTextColor={COLORS.textLight}/>
          </View>
          <Btn label={loading?'Processing…':`Fund ${amount?fmt(Number(amount)):''} Wallet`} onPress={handleFund} loading={loading} style={{marginBottom:24}}/>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    {flex:1,backgroundColor:COLORS.bg},
  balCard:      {paddingHorizontal:24,paddingBottom:28,paddingTop:12},
  balBtn:       {flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:'#fff',borderRadius:RADIUS.full,paddingVertical:12},
  referralCard: {flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#FFF7ED',borderRadius:RADIUS.xl,padding:16,marginBottom:20,borderWidth:1,borderColor:'#FED7AA'},
  modalSheet:   {backgroundColor:'#fff',borderTopLeftRadius:28,borderTopRightRadius:28,padding:24},
  qLabel:       {fontSize:11,fontWeight:FONTS.bold,color:COLORS.textMid,textTransform:'uppercase',letterSpacing:0.8,marginBottom:10},
  qChip:        {paddingHorizontal:16,paddingVertical:10,borderRadius:RADIUS.full,borderWidth:1.5,borderColor:COLORS.border,backgroundColor:'#fff'},
});
