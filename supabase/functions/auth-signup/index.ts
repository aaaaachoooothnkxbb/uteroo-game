
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array(passwordBuffer.length + salt.length);
  saltedPassword.set(passwordBuffer);
  saltedPassword.set(salt, passwordBuffer.length);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(salt);
  
  return JSON.stringify({ hash: hashArray, salt: saltArray });
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

    console.log('Attempting to create user:', username)

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('custom_users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create the user
    const { data: newUser, error } = await supabase
      .from('custom_users')
      .insert({
        username: username,
        password_hash: passwordHash
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create profile for the new user
    await supabase
      .from('profiles')
      .insert({
        id: newUser.id,
        username: username,
        onboarding_completed: false
      })

    console.log('User created successfully:', newUser.id)

    return new Response(
      JSON.stringify({ 
        user: { 
          id: newUser.id, 
          username: newUser.username 
        },
        message: 'Account created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
