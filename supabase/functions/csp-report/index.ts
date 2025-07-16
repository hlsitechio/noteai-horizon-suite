import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'blocked-uri': string;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'effective-directive': string;
    'original-policy': string;
    'sample'?: string;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const report: CSPReport = await req.json()
      const cspReport = report['csp-report']

      // Extract client information
      const userAgent = req.headers.get('user-agent') || 'Unknown'
      const clientIP = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'Unknown'

      // Prepare event data
      const eventData = {
        documentUri: cspReport['document-uri'],
        violatedDirective: cspReport['violated-directive'],
        blockedUri: cspReport['blocked-uri'],
        sourceFile: cspReport['source-file'],
        lineNumber: cspReport['line-number'],
        columnNumber: cspReport['column-number'],
        effectiveDirective: cspReport['effective-directive'],
        originalPolicy: cspReport['original-policy'],
        sample: cspReport['sample'],
        userAgent,
        clientIP,
        timestamp: new Date().toISOString()
      }

      // Filter out known false positives
      const ignoredSources = [
        'chrome-extension:',
        'safari-extension:',
        'moz-extension:',
        'about:blank',
        'data:text/html,chromewebdata'
      ]

      const shouldIgnore = ignoredSources.some(source => 
        cspReport['blocked-uri']?.startsWith(source)
      )

      if (!shouldIgnore) {
        // Log to security audit table
        const { error } = await supabase
          .from('security_audit_logs')
          .insert({
            event_type: 'CSP_VIOLATION',
            event_data: eventData,
            ip_address: clientIP,
            user_agent: userAgent
          })

        if (error) {
          console.error('Failed to log CSP violation:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to log violation' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Log for monitoring (development only)
        if (Deno.env.get('DENO_ENV') !== 'production') {
          console.log('CSP Violation Report:', {
            violatedDirective: cspReport['violated-directive'],
            blockedUri: cspReport['blocked-uri'],
            documentUri: cspReport['document-uri']
          })
        }
      }

      return new Response(
        JSON.stringify({ message: 'Report received' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('CSP Report Handler Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})