import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [wallet, setWallet]   = useState({ balance: 0 });
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type='info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) bootstrap(data.session.user);
      else setLoading(false);
    }).catch(() => setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) bootstrap(session.user);
      else { setUser(null); setOrders([]); setLoading(false); }
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  async function bootstrap(u) {
    setUser(u);
    try {
      const [w, o] = await Promise.allSettled([
        supabase.from('wallets').select('*').eq('user_id', u.id).single(),
        supabase.from('orders').select('*').eq('customer_id', u.id).order('created_at', { ascending: false }).limit(30),
      ]);
      if (w.value?.data) setWallet(w.value.data);
      if (o.value?.data) setOrders(o.value.data);
    } catch {}
    setLoading(false);
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async ({ email, password, name, phone, role='customer' }) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { name, phone, role } }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setOrders([]);
  };

  const createOrder = async (orderData) => {
    if (!user) throw new Error('Not logged in');
    const tracking_id = 'AMP-' + Date.now().toString(36).toUpperCase();
    const { data, error } = await supabase.from('orders')
      .insert({ ...orderData, customer_id: user.id, tracking_id })
      .select().single();
    if (error) throw error;
    setOrders(p => [data, ...p]);
    return data;
  };

  const fmt = (n) => '₦' + Number(n||0).toLocaleString();

  return (
    <Ctx.Provider value={{ user, wallet, orders, loading, toast, showToast, login, signup, logout, createOrder, fmt, setWallet }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
