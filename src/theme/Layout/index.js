import React from 'react';
import Layout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
  // No authentication or redirects — just render the layout directly
  return <Layout {...props} />;
}
