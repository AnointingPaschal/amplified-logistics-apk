import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { Btn } from '../../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../theme';

const LABELS  = {standard:'Standard Order',bulk:'Bulk Order',heavy:'Heavy & Relocation',interstate:'Inter-State'};
const SIZES   = [{id:'small',label:'Small',sub:'Max 5kg'},{id:'medium',label:'Medium',sub:'Max 20kg'},{id:'large',label:'Large',sub:'Max 100kg'}];
const CATS    = ['Food','Books','Document','Clothes','Medicine','Others'];
const PROTECT = [{id:'none',label:'No Protection',price:0},{id:'silver',label:'Silver',price:2000},{id:'gold',label:'Gold',price:4000},{id:'platinum',label:'Platinum',price:8000}];
const PRICES  = {standard:2500,bulk:8500,heavy:25000,interstate:45000};
const fmt     = n=>'₦'+Number(n||0).toLocaleString();

export default function CreateOrderScreen({ navigation, route }) {
  const { user, createOrder, showToast } = useApp();
  const insets = useSafeAreaInsets();
  const type   = route.params?.type||'standard';
  const [step,setStep]       = useState(1);
  const [pickup,setPickup]   = useState('');
  const [dropoff,setDropoff] = useState('');
  const [size,setSize]       = useState('small');
  const [cat,setCat]         = useState(null);
  const [protect,setProtect] = useState('none');
  const [recName,setRecName] = useState('');
  const [recPhone,setRecPhone]= useState('');
  const [notes,setNotes]     = useState('');
  const [loading,setLoading] = useState(false);
  const [done,setDone]       = useState(false);
  const [trackId,setTrackId] = useState('');

  const protPrice = PROTECT.find(p=>p.id===protect)?.price||0;
  const total     = PRICES[type]+protPrice;

  const handleSubmit = async () => {
    if (!user) { navigation.navigate('Login'); return; }
    setLoading(true);
    try {
      const order = await createOrder({ service_type:type, pickup_address:pickup, dropoff_address:dropoff, package_size:size, package_category:cat, protection_tier:protect, dropoff_name:recName, dropoff_phone:recPhone, note:notes, price:total, payment_method:'wallet' });
      setTrackId(order.tracking_id); setDone(true);
    } catch(e) { showToast(e.message||'Order failed','error'); }
    finally { setLoading(false); }
  };

  if (done) return (
    <LinearGradient colors={[COLORS.navy,'#0d2137']} style={{flex:1,alignItems:'center',justifyContent:'center',padding:32}}>
      <StatusBar style="light"/>
      <View style={{width:80,height:80,borderRadius:40,backgroundColor:'rgba(255,255,255,0.1)',alignItems:'center',justifyContent:'center',marginBottom:24}}>
        <Ionicons name="checkmark-circle" size={64} color={COLORS.green}/>
      </View>
      <Text style={{fontSize:28,fontWeight:FONTS.black,color:'#fff',marginBottom:8}}>Order Confirmed!</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.55)',marginBottom:32}}>Your delivery is being processed</Text>
      <View style={{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16,width:'100%',alignItems:'center',marginBottom:12}}>
        <Text style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:4}}>Tracking ID</Text>
        <Text style={{fontSize:22,fontWeight:FONTS.black,color:'#fff'}}>{trackId}</Text>
      </View>
      <View style={{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:16,padding:16,width:'100%',alignItems:'center',marginBottom:32}}>
        <Text style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:4}}>Total Paid</Text>
        <Text style={{fontSize:28,fontWeight:FONTS.black,color:'#fff'}}>{fmt(total)}</Text>
      </View>
      <Btn label="Back to Home" onPress={()=>navigation.navigate('Home')} variant="outline" style={{width:'100%',marginBottom:16}}/>
      <TouchableOpacity onPress={()=>navigation.navigate('Orders')}><Text style={{color:'rgba(255,255,255,0.5)',fontSize:13,textDecorationLine:'underline'}}>View all orders</Text></TouchableOpacity>
    </LinearGradient>
  );

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <StatusBar style="light"/>
      <LinearGradient colors={[COLORS.navy,'#0d2137']} style={[styles.header,{paddingTop:insets.top+12}]}>
        <TouchableOpacity onPress={()=>step>1?setStep(s=>s-1):navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff"/>
        </TouchableOpacity>
        <Text style={{flex:1,textAlign:'center',fontSize:16,fontWeight:FONTS.bold,color:'#fff',marginLeft:12}}>{LABELS[type]}</Text>
        <View style={{width:22}}/>
        <View style={{flexDirection:'row',gap:5,marginTop:12}}>
          {[1,2,3].map(s=><View key={s} style={{width:28,height:3,borderRadius:2,backgroundColor:'#fff',opacity:s<=step?1:0.3}}/>)}
        </View>
      </LinearGradient>

      <ScrollView style={{flex:1,backgroundColor:COLORS.bg}} contentContainerStyle={{padding:16}} keyboardShouldPersistTaps="handled">
        {step===1&&(
          <>
            <View style={styles.locCard}>
              <Text style={{fontSize:15,fontWeight:FONTS.bold,color:COLORS.navy,marginBottom:14}}>Where's Your Package Going?</Text>
              <View style={{flexDirection:'row',alignItems:'flex-start',gap:12,marginBottom:8}}>
                <View style={{width:12,height:12,borderRadius:6,backgroundColor:COLORS.green,marginTop:4,flexShrink:0}}/>
                <View style={{flex:1}}>
                  <Text style={styles.locLabel}>Pickup Location</Text>
                  <TextInput value={pickup} onChangeText={setPickup} placeholder="Enter exact pickup address..." placeholderTextColor={COLORS.textLight} style={styles.locInput} multiline/>
                </View>
              </View>
              <View style={{width:1.5,height:20,backgroundColor:COLORS.border,marginLeft:5,borderStyle:'dashed'}}/>
              <View style={{flexDirection:'row',alignItems:'flex-start',gap:12,marginTop:8}}>
                <View style={{width:12,height:12,borderRadius:6,backgroundColor:COLORS.red,marginTop:4,flexShrink:0}}/>
                <View style={{flex:1}}>
                  <Text style={styles.locLabel}>Dropoff Location</Text>
                  <TextInput value={dropoff} onChangeText={setDropoff} placeholder="Enter exact dropoff address..." placeholderTextColor={COLORS.textLight} style={styles.locInput} multiline/>
                </View>
              </View>
            </View>
            <Text style={styles.secTitle}>Package Size</Text>
            <View style={{flexDirection:'row',gap:10,marginBottom:16}}>
              {SIZES.map(s=>(
                <TouchableOpacity key={s.id} style={[styles.sizeCard,size===s.id&&styles.sizeCardActive]} onPress={()=>setSize(s.id)} activeOpacity={0.8}>
                  <Text style={[{fontSize:14,fontWeight:FONTS.bold,color:COLORS.textMid,marginBottom:2},size===s.id&&{color:COLORS.navy}]}>{s.label}</Text>
                  <Text style={{fontSize:10,color:COLORS.textLight}}>{s.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.secTitle}>What Are We Handling?</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:8}}>
              {CATS.map(c=>(
                <TouchableOpacity key={c} style={[styles.catChip,cat===c&&{backgroundColor:COLORS.navy,borderColor:COLORS.navy}]} onPress={()=>setCat(c)} activeOpacity={0.8}>
                  <Text style={[{fontSize:13,fontWeight:FONTS.semibold,color:COLORS.textMid},cat===c&&{color:'#fff'}]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {step===2&&(
          <>
            <Text style={styles.secTitle}>Recipient Details</Text>
            <View style={{backgroundColor:'#fff',borderRadius:RADIUS.xl,padding:16,marginBottom:16,...SHADOW.sm}}>
              <View style={{paddingBottom:14,borderBottomWidth:1,borderBottomColor:COLORS.border,marginBottom:14}}>
                <Text style={styles.locLabel}>Recipient Name</Text>
                <TextInput value={recName} onChangeText={setRecName} placeholder="Full name" placeholderTextColor={COLORS.textLight} style={{fontSize:14,color:COLORS.text,fontWeight:FONTS.medium}}/>
              </View>
              <View>
                <Text style={styles.locLabel}>Phone Number</Text>
                <TextInput value={recPhone} onChangeText={setRecPhone} placeholder="08012345678" keyboardType="phone-pad" placeholderTextColor={COLORS.textLight} style={{fontSize:14,color:COLORS.text,fontWeight:FONTS.medium}}/>
              </View>
            </View>
            <Text style={styles.secTitle}>Package Protection</Text>
            {PROTECT.map(p=>(
              <TouchableOpacity key={p.id} style={[styles.protectRow,protect===p.id&&{borderColor:COLORS.navy}]} onPress={()=>setProtect(p.id)} activeOpacity={0.8}>
                <View style={[{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:COLORS.border,marginRight:12,alignItems:'center',justifyContent:'center'},protect===p.id&&{borderColor:COLORS.navy}]}>
                  {protect===p.id&&<View style={{width:10,height:10,borderRadius:5,backgroundColor:COLORS.navy}}/>}
                </View>
                <Text style={{flex:1,fontSize:14,fontWeight:FONTS.semibold,color:COLORS.navy}}>{p.label}</Text>
                {p.price>0&&<Text style={{fontSize:13,fontWeight:FONTS.bold,color:COLORS.textMid}}>{fmt(p.price)}</Text>}
              </TouchableOpacity>
            ))}
          </>
        )}
        {step===3&&(
          <>
            <View style={{backgroundColor:'#fff',borderRadius:RADIUS.xl,padding:16,marginBottom:12,...SHADOW.md}}>
              <Text style={{fontSize:15,fontWeight:FONTS.bold,color:COLORS.navy,marginBottom:14}}>Order Summary</Text>
              {[['From',pickup],['To',dropoff],['Size',size],['Category',cat||'—'],['Protection',protect]].map(([k,v])=>(
                <View key={k} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <Text style={{fontSize:13,color:COLORS.textMid,flex:1}}>{k}</Text>
                  <Text style={{fontSize:13,fontWeight:FONTS.semibold,color:COLORS.navy,flex:2,textAlign:'right'}} numberOfLines={2}>{v}</Text>
                </View>
              ))}
              <View style={{borderTopWidth:1.5,borderTopColor:COLORS.border,marginTop:8,paddingTop:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontWeight:FONTS.bold,color:COLORS.navy,fontSize:15}}>Total</Text>
                <Text style={{fontSize:20,fontWeight:FONTS.black,color:COLORS.navy}}>{fmt(total)}</Text>
              </View>
            </View>
            <View style={{backgroundColor:'#fff',borderRadius:RADIUS.lg,padding:14,flexDirection:'row',alignItems:'center',gap:10,...SHADOW.sm}}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.navy}/>
              <Text style={{flex:1,fontSize:14,fontWeight:FONTS.semibold,color:COLORS.navy}}>Pay with Amplified Wallet</Text>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green}/>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.cta,{paddingBottom:insets.bottom+12}]}>
        {step<3 ? (
          <Btn label="Continue  →" onPress={()=>{
            if(step===1&&(!pickup||!dropoff)){showToast('Enter pickup and dropoff','error');return;}
            if(step===2&&(!recName||!recPhone)){showToast('Enter recipient details','error');return;}
            setStep(s=>s+1);
          }}/>
        ) : (
          <Btn label={loading?'Processing…':`Confirm & Pay  ${fmt(total)}`} onPress={handleSubmit} loading={loading}/>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header:      {paddingHorizontal:20,paddingBottom:18},
  locCard:     {backgroundColor:'#fff',borderRadius:RADIUS.xl,padding:16,marginBottom:16,...SHADOW.md},
  locLabel:    {fontSize:11,fontWeight:FONTS.bold,color:COLORS.textLight,textTransform:'uppercase',letterSpacing:0.6,marginBottom:4},
  locInput:    {fontSize:14,color:COLORS.text,fontWeight:FONTS.medium,lineHeight:20},
  secTitle:    {fontSize:14,fontWeight:FONTS.bold,color:COLORS.navy,marginBottom:10,marginTop:4},
  sizeCard:    {flex:1,backgroundColor:'#fff',borderRadius:RADIUS.lg,padding:14,alignItems:'center',borderWidth:2,borderColor:COLORS.border,...SHADOW.sm},
  sizeCardActive:{borderColor:COLORS.navy,backgroundColor:'#EEF2FF'},
  catChip:     {paddingHorizontal:14,paddingVertical:8,borderRadius:RADIUS.full,backgroundColor:'#fff',borderWidth:1.5,borderColor:COLORS.border},
  protectRow:  {flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:RADIUS.lg,padding:14,marginBottom:8,borderWidth:2,borderColor:COLORS.border,...SHADOW.sm},
  cta:         {backgroundColor:'#fff',paddingHorizontal:16,paddingTop:12,borderTopWidth:1,borderTopColor:COLORS.border},
});
