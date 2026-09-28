import React, { useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS } from '../theme';
import { autocompletePlaces, geocodePlace } from '../lib/places';

/**
 * Drop-in replacement for a plain address TextInput.
 * Type >=3 chars -> shows Google-powered suggestions (via SerpApi, proxied
 * through our Cloudflare Worker). Picking one resolves lat/lng and calls
 * onSelect({ address, lat, lng }).
 */
export default function PlacesAutocomplete({
  value,
  onChangeText,
  onSelect,
  placeholder,
  userCoords,
  multiline = true,
  inputStyle,
  style,
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const search = (text) => {
    onChangeText(text);
    setOpen(true);
    clearTimeout(timer.current);

    if (text.trim().length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const preds = await autocompletePlaces(text, userCoords);
        setResults(preds);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const pick = async (item) => {
    onChangeText(item.description);
    setOpen(false);
    setResults([]);
    setResolving(true);
    try {
      const geo = await geocodePlace(item.description);
      onSelect?.({ address: item.description, lat: geo.lat, lng: geo.lng });
    } catch {
      onSelect?.({ address: item.description, lat: null, lng: null });
    } finally {
      setResolving(false);
    }
  };

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <TextInput
          value={value}
          onChangeText={search}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          multiline={multiline}
          style={[{ flex: 1 }, inputStyle]}
        />
        {(loading || resolving) && (
          <ActivityIndicator size="small" color={COLORS.navy} style={{ marginTop: 4 }} />
        )}
      </View>

      {open && results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((r, i) => (
            <TouchableOpacity
              key={r.place_id || i}
              style={[styles.row, i < results.length - 1 && styles.rowBorder]}
              onPress={() => pick(r)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={16} color={COLORS.textMid} style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.rowText} numberOfLines={2}>{r.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', padding: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowText: { flex: 1, fontSize: 13, color: COLORS.text, fontWeight: FONTS.medium },
});
