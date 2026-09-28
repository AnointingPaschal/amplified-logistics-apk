import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export default function LeafletMap({ height = '100%', markers = [], showUserLocation = true, style }) {
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

  const center = userCoords
    ? `[${userCoords.lat}, ${userCoords.lng}]`
    : '[5.4527, 7.5248]'; // Default: Umuahia

  const zoom = userCoords ? 14 : 12;

  const markersJS = [
    ...(userCoords ? [{
      lat: userCoords.lat, lng: userCoords.lng,
      color: '#0A1628', label: 'You are here', pulse: true
    }] : []),
    ...markers,
  ].map(m => `
    (function() {
      var el = L.divIcon({
        className: '',
        html: '<div style="width:${m.pulse ? 16 : 12}px;height:${m.pulse ? 16 : 12}px;background:${m.color || '#F97316'};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);${m.pulse ? 'animation:pulse 1.5s infinite;' : ''}"></div>',
        iconSize: [${m.pulse ? 16 : 12}, ${m.pulse ? 16 : 12}],
        iconAnchor: [${m.pulse ? 8 : 6}, ${m.pulse ? 8 : 6}],
      });
      L.marker([${m.lat}, ${m.lng}], {icon: el}).addTo(map)
        .bindPopup('${m.label || ''}');
    })();
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100vh; }
    .leaflet-control-zoom { display:none; }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(10,22,40,0.4); }
      70% { box-shadow: 0 0 0 12px rgba(10,22,40,0); }
      100% { box-shadow: 0 0 0 0 rgba(10,22,40,0); }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      center: ${center},
      zoom: ${zoom},
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    ${markersJS}

    map.on('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapClick',
        lat: e.latlng.lat,
        lng: e.latlng.lng,
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
        onMessage={() => {}}
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
    </View>
  );
}
