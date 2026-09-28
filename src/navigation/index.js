import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, FONTS } from '../theme';

import SplashScreen       from '../screens/auth/SplashScreen';
import LoginScreen        from '../screens/auth/LoginScreen';
import SignupScreen       from '../screens/auth/SignupScreen';
import HomeScreen         from '../screens/customer/HomeScreen';
import CreateOrderScreen  from '../screens/customer/CreateOrderScreen';
import OrdersScreen       from '../screens/customer/OrdersScreen';
import TrackOrderScreen   from '../screens/customer/TrackOrderScreen';
import WalletScreen       from '../screens/customer/WalletScreen';
import ProfileScreen      from '../screens/customer/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const ICONS        = { Home:'home-outline', Orders:'cube-outline', Track:'navigate-outline', Wallet:'wallet-outline', Profile:'person-outline' };
const ICONS_ACTIVE = { Home:'home',         Orders:'cube',         Track:'navigate',         Wallet:'wallet',         Profile:'person'         };

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E8ECF0',
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.navy,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 10, fontWeight: FONTS.semibold, marginBottom: 2 },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={focused ? ICONS_ACTIVE[route.name] : ICONS[route.name]} size={22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Orders"  component={OrdersScreen} />
      <Tab.Screen name="Track"   component={TrackOrderScreen} />
      <Tab.Screen name="Wallet"  component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { user, loading } = useApp();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !user ? (
          <>
            <Stack.Screen name="Login"  component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main"        component={Tabs} />
            <Stack.Screen name="CreateOrder" component={CreateOrderScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="TrackOrder"  component={TrackOrderScreen}  options={{ presentation: 'modal' }} />
            <Stack.Screen name="Wallet"      component={WalletScreen} />
            <Stack.Screen name="Profile"     component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
