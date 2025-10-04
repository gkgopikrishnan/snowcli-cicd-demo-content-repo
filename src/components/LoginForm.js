import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const approvedEmails = ['gksmartdba@gmail.com']; // Your pre-approved users

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('🔐 Attempting login for:', email);

    if (!approvedEmails.includes(email)) {
      setStatus('❌ This email is not authorized.');
      console.warn('❌ Unauthorized email:', email);
      return;
    }

    // Choose URL based on environment
    const redirectURL = 
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/after-login'
        : 'https://celebrated-faun-5a3353.netlify.app/after-login';

    console.log('📨 Sending OTP magic link to:', email);
    console.log('🔁 Redirect URL will be:', redirectURL);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectURL,
      },
    });

    if (error) {
      console.error('❌ Error sending OTP:', error.message);
      setStatus(`❌ ${error.message}`);
    } else {
      console.log('✅ OTP sent successfully to email:', email);
      setStatus('✅ Check your email for a login link!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login with Email</h2>
      <input
        type="email"
        value={email}
        placeholder="Enter approved email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Magic Link</button>
      <p>{status}</p>
    </form>
  );
}
