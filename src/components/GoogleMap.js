import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// Same props shape as the old LeafletMap, so it drops in as a replacement.
// Renders real Google Maps inside a WebView (no native rebuild needed —
// keeps working in Expo Go).
export default function GoogleMap({ height = '100%', markers = [], showUserLocation = true, style, onMapClick }) {
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (!showUserLocation) return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    // Fails loud in dev so a missing key doesn't look like a blank map bug.
    return (
      <View style={[{ height, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }, style]} />
    );
  }

  const center = userCoords || { lat: 5.4527, lng: 7.5248 }; // Default: Umuahia
  const zoom = userCoords ? 14 : 12;

  const allMarkers = [
    ...(userCoords ? [{ lat: userCoords.lat, lng: userCoords.lng, color: '#0A1628', label: 'You are here', pulse: true }] : []),
    ...markers,
  ];

  const markersJS = allMarkers.map((m) => `
    new google.maps.Marker({
      position: { lat: ${m.lat}, lng: ${m.lng} },
      map: map,
      title: ${JSON.stringify(m.label || '')},
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: ${m.pulse ? 9 : 7},
        fillColor: '${m.color || '#F97316'}',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}"></script>
  <script>
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: ${center.lat}, lng: ${center.lng} },
      zoom: ${zoom},
      disableDefaultUI: true,
      zoomControl: false,
      clickableIcons: false,
    });

    ${markersJS}

    map.addListener('click', function (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapClick',
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }));
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={[{ height }, style]}>
      <WebView
        source={{ html }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === 'mapClick') onMapClick?.({ lat: msg.lat, lng: msg.lng });
          } catch {}
        }}
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
    </View>
  );
}
