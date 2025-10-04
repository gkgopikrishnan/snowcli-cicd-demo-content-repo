import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Run only on client

    async function checkAuth() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        history.push('/login');
      } else if (session?.user) {
        history.push('/docs');
      } else {
        history.push('/login');
      }
      setLoading(false);
    }

    checkAuth();
  }, [history]);

  return <p>{loading ? 'Checking authentication...' : 'Redirecting...'}</p>;
}
