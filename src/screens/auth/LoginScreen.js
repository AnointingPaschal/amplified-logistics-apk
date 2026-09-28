import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { Btn, Input } from '../../components';
import { COLORS, FONTS, RADIUS } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handle = async () => {
    if (!email||!password) { setError('Fill in all fields'); return; }
    setLoading(true); setError('');
    try { await login(email.trim(), password); }
    catch(e) { setError(e.message||'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <StatusBar style="light"/>
      <LinearGradient colors={[COLORS.navy,'#0d2137']} style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}><Ionicons name="flash" size={22} color="#fff"/></View>
          <Text style={styles.brand}>amplified</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to your account</Text>
      </LinearGradient>
      <ScrollView style={{flex:1,backgroundColor:COLORS.bg}} contentContainerStyle={{padding:24}} keyboardShouldPersistTaps="handled">
        <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" icon="mail-outline"/>
        <View style={{position:'relative'}}>
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry={!showPw} icon="lock-closed-outline"/>
          <TouchableOpacity onPress={()=>setShowPw(!showPw)} style={styles.eye}>
            <Ionicons name={showPw?'eye-off-outline':'eye-outline'} size={20} color={COLORS.textLight}/>
          </TouchableOpacity>
        </View>
        {!!error && <View style={styles.errBox}><Ionicons name="alert-circle" size={16} color={COLORS.red}/><Text style={styles.errText}>{error}</Text></View>}
        <Btn label="Sign In" onPress={handle} loading={loading} style={{marginTop:8,marginBottom:20}}/>
        <TouchableOpacity style={{alignItems:'center'}} onPress={()=>navigation.navigate('Signup')}>
          <Text style={{fontSize:14,color:COLORS.textMid}}>Don't have an account? <Text style={{fontWeight:FONTS.bold,color:COLORS.navy}}>Create one →</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header:  {paddingTop:60,paddingBottom:36,paddingHorizontal:24},
  logoRow: {flexDirection:'row',alignItems:'center',gap:10,marginBottom:28},
  logoBox: {width:40,height:40,borderRadius:12,backgroundColor:'rgba(255,255,255,0.12)',alignItems:'center',justifyContent:'center'},
  brand:   {fontSize:22,fontWeight:FONTS.black,color:'#fff',letterSpacing:-0.5},
  title:   {fontSize:28,fontWeight:FONTS.black,color:'#fff',marginBottom:6},
  sub:     {fontSize:14,color:'rgba(255,255,255,0.55)'},
  eye:     {position:'absolute',right:14,top:38},
  errBox:  {flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#FEE2E2',borderRadius:10,padding:12,marginBottom:12},
  errText: {fontSize:13,color:COLORS.red,flex:1},
});
