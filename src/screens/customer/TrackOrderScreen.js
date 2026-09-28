import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components';
import { COLORS, FONTS, SHADOW, RADIUS } from '../../theme';

const STEPS = [
  {key:'pending',label:'Order Placed',icon:'receipt-outline'},
  {key:'accepted',label:'Rider Assigned',icon:'person-outline'},
  {key:'pickup',label:'Picked Up',icon:'archive-outline'},
  {key:'transit',label:'In Transit',icon:'navigate-outline'},
  {key:'delivered',label:'Delivered',icon:'checkmark-circle-outline'},
];
const ORDER = ['pending','accepted','pickup','transit','delivered'];

export default function TrackOrderScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const order = route.params?.order||{};
  const [eta, setEta] = useState(18);
  const stepIdx = ORDER.indexOf(order.status||'transit');
  const isActive = ['pending','accepted','pickup','transit'].includes(order.status);

  useEffect(()=>{
    if(!isActive) return;
    const t = setInterval(()=>setEta(e=>Math.max(1,e-0.3)),3000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <View style={{flex:1,backgroundColor:COLORS.bg}}>
      <StatusBar style="light"/>
      <LinearGradient colors={[COLORS.navy,COLORS.navyMid,'#1a4a7a']} style={styles.mapBg}>
        <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
          <View style={{width:2,height:120,backgroundColor:'rgba(255,255,255,0.3)',position:'absolute'}}/>
          <View style={{position:'absolute',top:40}}><Ionicons name="radio-button-on" size={24} color={COLORS.green}/></View>
          {isActive&&<View style={{position:'absolute',top:'45%'}}><View style={{width:36,height:36,borderRadius:18,backgroundColor:COLORS.navy,borderWidth:2.5,borderColor:'#fff',alignItems:'center',justifyContent:'center'}}><Ionicons name="bicycle" size={18} color="#fff"/></View></View>}
          <View style={{position:'absolute',bottom:40}}><Ionicons name="location" size={28} color={COLORS.red}/></View>
          {isActive&&<View style={{position:'absolute',bottom:16,flexDirection:'row',alignItems:'center',gap:6,backgroundColor:COLORS.navy,paddingHorizontal:14,paddingVertical:8,borderRadius:20}}>
            <View style={{width:7,height:7,borderRadius:4,backgroundColor:COLORS.green}}/>
            <Text style={{color:'#fff',fontSize:12,fontWeight:FONTS.bold}}>{Math.round(eta)} min away</Text>
          </View>}
        </View>
      </LinearGradient>

      <TouchableOpacity onPress={()=>navigation.goBack()} style={[styles.backBtn,{top:insets.top+12}]}>
        <Ionicons name="arrow-back" size={20} color={COLORS.navy}/>
      </TouchableOpacity>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <Text style={{fontSize:14,fontWeight:FONTS.bold,color:COLORS.navy}}>{order.tracking_id||'AMP-DEMO001'}</Text>
            <Badge status={order.status||'transit'}/>
          </View>
          <View style={{marginBottom:20}}>
            {STEPS.map((s,i)=>{
              const done=i<=stepIdx, active=i===stepIdx;
              return (
                <View key={s.key} style={{flexDirection:'row',gap:14}}>
                  <View style={{alignItems:'center',width:30}}>
                    <View style={[{width:28,height:28,borderRadius:14,backgroundColor:'#E5E7EB',alignItems:'center',justifyContent:'center'},done&&{backgroundColor:COLORS.navy},active&&{backgroundColor:COLORS.orange}]}>
                      <Ionicons name={s.icon} size={13} color={done?'#fff':'#D1D5DB'}/>
                    </View>
                    {i<STEPS.length-1&&<View style={[{width:2,flex:1,backgroundColor:'#E5E7EB',marginVertical:3},i<stepIdx&&{backgroundColor:COLORS.navy}]}/>}
                  </View>
                  <View style={{flex:1,paddingBottom:i<STEPS.length-1?20:0}}>
                    <Text style={[{fontSize:13,fontWeight:FONTS.semibold,color:COLORS.navy,paddingTop:4},!done&&{color:COLORS.textLight}]}>{s.label}</Text>
                    {active&&<Text style={{fontSize:11,color:COLORS.orange,marginTop:2}}>In progress…</Text>}
                  </View>
                </View>
              );
            })}
          </View>
          {stepIdx>=1&&(
            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.bg,borderRadius:16,padding:14,marginBottom:14,gap:12}}>
              <View style={{width:48,height:48,borderRadius:14,backgroundColor:COLORS.navy,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:FONTS.black,fontSize:18}}>E</Text></View>
              <View style={{flex:1}}>
                <Text style={{fontSize:14,fontWeight:FONTS.bold,color:COLORS.navy}}>Emeka Okonkwo</Text>
                <Text style={{fontSize:12,color:COLORS.textMid}}>Motorcycle • ABI 234 KE</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:3,marginTop:2}}>
                  <Ionicons name="star" size={12} color={COLORS.amber}/>
                  <Text style={{fontSize:11,color:COLORS.textMid}}>4.8 • 342 deliveries</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',gap:8}}>
                <TouchableOpacity style={{width:40,height:40,borderRadius:12,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',...SHADOW.sm}}>
                  <Ionicons name="call-outline" size={20} color={COLORS.green}/>
                </TouchableOpacity>
                <TouchableOpacity style={{width:40,height:40,borderRadius:12,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',...SHADOW.sm}}>
                  <Ionicons name="chatbubble-outline" size={20} color={COLORS.navyMid}/>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={{backgroundColor:COLORS.bg,borderRadius:16,padding:14,marginBottom:12}}>
            <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8}}>
              <View style={{width:10,height:10,borderRadius:5,backgroundColor:COLORS.green}}/>
              <Text style={{flex:1,fontSize:13,color:COLORS.textMid}}>{order.pickup_address||'Pickup location'}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
              <View style={{width:10,height:10,borderRadius:5,backgroundColor:COLORS.red}}/>
              <Text style={{flex:1,fontSize:13,color:COLORS.textMid}}>{order.dropoff_address||'Dropoff location'}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:COLORS.navy,borderRadius:16,padding:14}}>
            <Text style={{fontSize:13,color:'rgba(255,255,255,0.6)'}}>Total</Text>
            <Text style={{fontSize:20,fontWeight:FONTS.black,color:'#fff'}}>₦{Number(order.price||0).toLocaleString()}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapBg:   {height:'42%'},
  backBtn: {position:'absolute',left:16,zIndex:10,width:38,height:38,borderRadius:19,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',...SHADOW.md},
  sheet:   {flex:1,backgroundColor:'#fff',borderTopLeftRadius:28,borderTopRightRadius:28,...SHADOW.lg,marginTop:-28},
});
