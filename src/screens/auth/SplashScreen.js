import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../theme';

export default function SplashScreen({ navigation }) {
  const scale   = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const tagOp   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(tagOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Login'), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={[COLORS.navy, '#0a1f3a', '#0d2850']} style={styles.c}>
      <StatusBar style="light" />
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }], opacity }}>
        <View style={styles.logoBox}>
          <Ionicons name="flash" size={46} color="#fff" />
        </View>
        <Text style={styles.brand}>amplified</Text>
        <Text style={styles.tagline}>Logistics</Text>
      </Animated.View>
      <Animated.View style={[styles.tagWrap, { opacity: tagOp }]}>
        <View style={styles.tagRow}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>Fast. Safe. Amplified.</Text>
          <View style={styles.tagDot} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  c:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoBox:  { width: 96, height: 96, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 22, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)' },
  brand:    { fontSize: 40, fontWeight: FONTS.black, color: '#fff', letterSpacing: -1.5 },
  tagline:  { fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 6, marginTop: 4, textTransform: 'uppercase' },
  tagWrap:  { position: 'absolute', bottom: 60 },
  tagRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tagDot:   { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  tagText:  { fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
});
