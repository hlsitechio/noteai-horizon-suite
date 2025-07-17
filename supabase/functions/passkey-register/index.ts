import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateRegistrationOptions, verifyRegistrationResponse } from 'https://esm.sh/@simplewebauthn/server@9.0.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const relyingPartyID = new URL(req.url).hostname
    const relyingPartyName = 'Lovable App'

    const url = new URL(req.url)
    const isStartEndpoint = url.pathname.includes('start') || url.pathname.endsWith('passkey-register')
    const isFinishEndpoint = url.pathname.includes('finish')

    if (isStartEndpoint) {
      // Generate registration options
      const options = await generateRegistrationOptions({
        rpName: relyingPartyName,
        rpID: relyingPartyID,
        userName: user.email!,
        userDisplayName: user.user_metadata?.display_name || user.email!.split('@')[0],
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform'
        },
        // Custom user ID using the user's UUID
        userID: new TextEncoder().encode(user.id)
      })

      // Store the challenge
      const { error: challengeError } = await supabaseClient
        .schema('webauthn')
        .from('challenges')
        .insert({
          user_id: user.id,
          value: options.challenge
        })

      if (challengeError) {
        console.error('Error storing challenge:', challengeError)
        return new Response(
          JSON.stringify({ error: 'Failed to store challenge' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify(options),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (isFinishEndpoint || req.method === 'POST') {
      const credential = await req.json()

      // Get and delete the challenge
      const { data: challenge, error: challengeError } = await supabaseClient
        .schema('webauthn')
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (challengeError || !challenge) {
        return new Response(
          JSON.stringify({ error: 'Challenge not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Delete the challenge immediately
      await supabaseClient
        .schema('webauthn')
        .from('challenges')
        .delete()
        .eq('id', challenge.id)

      // Verify the registration
      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: challenge.value,
        expectedOrigin: new URL(req.url).origin,
        expectedRPID: relyingPartyID
      })

      if (!verification.verified || !verification.registrationInfo) {
        return new Response(
          JSON.stringify({ error: 'Registration verification failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Store the credential
      const { registrationInfo } = verification
      const { data: savedCredential, error: saveError } = await supabaseClient
        .schema('webauthn')
        .from('credentials')
        .insert({
          user_id: user.id,
          friendly_name: `Passkey created ${new Date().toLocaleString()}`,
          credential_type: 'public-key',
          credential_id: Buffer.from(registrationInfo.credentialID).toString('base64url'),
          public_key: Buffer.from(registrationInfo.credentialPublicKey),
          aaguid: registrationInfo.aaguid || '00000000-0000-0000-0000-000000000000',
          sign_count: registrationInfo.counter,
          transports: credential.response.transports || [],
          user_verification_status: registrationInfo.userVerified ? 'verified' : 'unverified',
          device_type: registrationInfo.credentialDeviceType === 'singleDevice' ? 'single_device' : 'multi_device',
          backup_state: registrationInfo.credentialBackedUp ? 'backed_up' : 'not_backed_up'
        })
        .select()
        .single()

      if (saveError) {
        console.error('Error saving credential:', saveError)
        return new Response(
          JSON.stringify({ error: 'Failed to save credential' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          verified: true,
          credential: savedCredential
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in passkey registration:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})