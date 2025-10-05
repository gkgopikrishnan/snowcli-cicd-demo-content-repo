import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    // Directly redirect to docs page (no authentication)
    history.push('/docs');
  }, [history]);

  return <p>Redirecting to documentation...</p>;
}
