
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Password verification using Web Crypto API
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const { hash, salt } = JSON.parse(storedHash);
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = new Uint8Array(salt);
    const saltedPassword = new Uint8Array(passwordBuffer.length + saltBuffer.length);
    saltedPassword.set(passwordBuffer);
    saltedPassword.set(saltBuffer, passwordBuffer.length);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return JSON.stringify(hashArray) === JSON.stringify(hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Username and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Attempting login for username:', username)

    // Find user by username
    const { data: user, error: userError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('username', username)
      .single()

    if (userError || !user) {
      console.log('User not found:', username)
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password_hash)

    if (!passwordMatch) {
      console.log('Password mismatch for user:', username)
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Log the login activity
    await supabase
      .from('user_login_activities')
      .insert({
        user_id: user.id,
        login_timestamp: new Date().toISOString()
      })

    console.log('Login successful for user:', user.id)

    return new Response(
      JSON.stringify({ 
        user: { 
          id: user.id, 
          username: user.username,
          email: `${user.username}@custom.local` // Fake email for compatibility
        },
        profile: profile,
        message: 'Login successful'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
