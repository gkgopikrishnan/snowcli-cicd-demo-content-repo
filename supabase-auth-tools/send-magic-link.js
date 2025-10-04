const { createClient } = require('@supabase/supabase-js');

// 🔐 Directly specify your Supabase credentials (not recommended for production)
const SUPABASE_URL = 'https://askoayqdiyhpcpjosvko.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza29heXFkaXlocGNwam9zdmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkyMjg2OCwiZXhwIjoyMDYzNDk4ODY4fQ.PfzbBS1ij4E7UOXzuc7VC1WVurmz7CsihLAijcVQDEA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Approved email list (only these will get links)
const approvedEmails = [
  'gksmartdba@gmail.com' // Add more if needed
];

async function sendMagicLink(email) {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: 'https://celebrated-faun-5a3353.netlify.app/after-login', // 🔁 Update to your real redirect
    },
  });

  if (error) {
    console.error(`❌ Error sending to ${email}:`, error.message);
  } else {
    console.log(`✅ Magic link sent to: ${email}`);
    console.log(data);
  }
}

async function sendAllApprovedLinks() {
  for (const email of approvedEmails) {
    await sendMagicLink(email);
  }
}

sendAllApprovedLinks();
