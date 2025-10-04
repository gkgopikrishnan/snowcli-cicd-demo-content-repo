import React, { useEffect, useState } from 'react';
import Layout from '@theme-original/Layout';
import { useLocation, useHistory } from '@docusaurus/router';
import { supabase } from '../../lib/supabaseClient';

export default function LayoutWrapper(props) {
  const location = useLocation();
  const history = useHistory();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentPath = location.pathname;

      const publicPaths = ['/', '/login', '/magic']; // adjust if needed

      const isPublic = publicPaths.includes(currentPath);

      if (!session && !isPublic) {
        // Redirect unauthenticated users from private pages
        history.replace('/login');
      } else if (session && currentPath === '/') {
        // Redirect authenticated users away from root
        history.replace('/docs');
      }

      setChecked(true);
    };

    checkSession();
  }, [location.pathname]);

  // Wait until session check is done
  if (!checked) return null;

  return <Layout {...props} />;
}
