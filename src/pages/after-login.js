import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AfterLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let redirectTimer = null;

    const handleSession = async () => {
      console.log('🌐 Checking session after magic link...');

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (session) {
        console.log('✅ Session found via getSession');
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          redirectTimer = setTimeout(() => {
            window.location.href = '/docs';
          }, 1000);
        } else {
          console.error('❌ Error getting user:', userError?.message);
          setErrorMsg(userError?.message || 'User not found');
        }
      } else {
        console.warn('⚠️ No session from getSession, using onAuthStateChange...');
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              const { data: { user }, error } = await supabase.auth.getUser();
              if (user) {
                setUser(user);
                redirectTimer = setTimeout(() => {
                  window.location.href = '/docs';
                }, 1000);
              } else {
                setErrorMsg(error?.message || 'User not found');
              }
            } else {
              setErrorMsg('No session after auth state change');
            }

            setLoading(false);
          }
        );

        return () => listener.subscription.unsubscribe();
      }

      setLoading(false);
    };

    handleSession();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, []);

  if (loading) return <p>🔄 Logging in, please wait...</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>❌ {errorMsg}</p>;

  return (
    <div>
      <h2>✅ Welcome!</h2>
      <p>Logged in as: <strong>{user?.email}</strong></p>
      <p>Redirecting to <code>/docs</code>...</p>
    </div>
  );
}
