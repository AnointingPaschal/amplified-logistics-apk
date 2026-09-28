import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { Btn, Input } from '../../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../theme';

const ROLES = [
  {id:'customer',label:'Customer',icon:'person-outline',desc:'Send packages'},
  {id:'rider',label:'Rider',icon:'bicycle-outline',desc:'Deliver packages'},
  {id:'merchant',label:'Merchant',icon:'storefront-outline',desc:'Business orders'},
];

export default function SignupScreen({ navigation }) {
  const { signup } = useApp();
  const [step, setStep]     = useState(1);
  const [role, setRole]     = useState('customer');
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSignup = async () => {
    if (!email||!pw) { setError('Fill all fields'); return; }
    if (pw.length<6) { setError('Password must be 6+ characters'); return; }
    setLoading(true); setError('');
    try { await signup({ email:email.trim(), password:pw, name, phone, role }); }
    catch(e) {
      const m = e.message||'';
      setError(m.toLowerCase().includes('already')?'Email already registered. Please login.':m||'Signup failed');
    }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <StatusBar style="light"/>
      <LinearGradient colors={[COLORS.navy,'#0d2137']} style={styles.header}>
        <TouchableOpacity onPress={()=>step>1?setStep(1):navigation.goBack()} style={{marginBottom:20}}>
          <Ionicons name="arrow-back" size={22} color="#fff"/>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginBottom:16}}>Step {step} of 2</Text>
        <View style={{flexDirection:'row',gap:6}}>
          {[1,2].map(s=><View key={s} style={{height:3,flex:1,borderRadius:2,backgroundColor:s<=step?'#fff':'rgba(255,255,255,0.3)'}}/>)}
        </View>
      </LinearGradient>
      <ScrollView style={{flex:1,backgroundColor:COLORS.bg}} contentContainerStyle={{padding:24}} keyboardShouldPersistTaps="handled">
        {step===1 ? (
          <>
            <Text style={styles.sLabel}>I am a...</Text>
            <View style={{flexDirection:'row',gap:10,marginBottom:22}}>
              {ROLES.map(r=>(
                <TouchableOpacity key={r.id} style={[styles.roleCard,role===r.id&&styles.roleCardActive]} onPress={()=>setRole(r.id)} activeOpacity={0.8}>
                  <View style={[styles.roleIcon,role===r.id&&{backgroundColor:COLORS.navy}]}>
                    <Ionicons name={r.icon} size={22} color={role===r.id?'#fff':COLORS.navyMid}/>
                  </View>
                  <Text style={[styles.roleLabel,role===r.id&&{color:COLORS.navy}]}>{r.label}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" icon="person-outline"/>
            <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="08012345678" keyboardType="phone-pad" icon="call-outline"/>
            {!!error && <Text style={{color:COLORS.red,fontSize:12,marginBottom:12}}>{error}</Text>}
            <Btn label="Continue →" onPress={()=>{if(name&&phone){setError('');setStep(2);}else setError('Fill all fields');}}/>
          </>
        ) : (
          <>
            <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" icon="mail-outline"/>
            <View style={{position:'relative'}}>
              <Input label="Password" value={pw} onChangeText={setPw} placeholder="Min 6 characters" secureTextEntry={!showPw} icon="lock-closed-outline"/>
              <TouchableOpacity onPress={()=>setShowPw(!showPw)} style={{position:'absolute',right:14,top:38}}>
                <Ionicons name={showPw?'eye-off-outline':'eye-outline'} size={20} color={COLORS.textLight}/>
              </TouchableOpacity>
            </View>
            {!!error && <View style={styles.errBox}><Ionicons name="alert-circle" size={16} color={COLORS.red}/><Text style={{fontSize:12,color:COLORS.red,flex:1}}>{error}</Text></View>}
            <Btn label="Create Account" onPress={handleSignup} loading={loading} style={{marginTop:8}}/>
            <TouchableOpacity style={{alignItems:'center',marginTop:20}} onPress={()=>navigation.navigate('Login')}>
              <Text style={{fontSize:14,color:COLORS.textMid}}>Already have an account? <Text style={{fontWeight:FONTS.bold,color:COLORS.navy}}>Sign in</Text></Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header:       {paddingTop:56,paddingBottom:28,paddingHorizontal:24},
  title:        {fontSize:28,fontWeight:FONTS.black,color:'#fff',marginBottom:4},
  sLabel:       {fontSize:13,fontWeight:FONTS.bold,color:COLORS.textMid,textTransform:'uppercase',letterSpacing:0.8,marginBottom:14},
  roleCard:     {flex:1,backgroundColor:'#fff',borderRadius:RADIUS.lg,padding:14,alignItems:'center',borderWidth:2,borderColor:'#E8ECF0',...SHADOW.sm},
  roleCardActive:{borderColor:COLORS.navy,backgroundColor:'#F0F4FF'},
  roleIcon:     {width:44,height:44,borderRadius:13,backgroundColor:'#F3F4F6',alignItems:'center',justifyContent:'center',marginBottom:8},
  roleLabel:    {fontSize:12,fontWeight:FONTS.bold,color:COLORS.textMid,marginBottom:2},
  roleDesc:     {fontSize:10,color:COLORS.textLight,textAlign:'center'},
  errBox:       {flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#FEE2E2',borderRadius:10,padding:12,marginBottom:12},
});
