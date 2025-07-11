import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VisitorData {
  websiteDomain: string
  pagePath: string
  visitorId: string
  sessionId: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  deviceType?: string
  browser?: string
  os?: string
  screenResolution?: string
  pageLoadTime?: number
  timeOnPage?: number
  conversionEvent?: string
}

function detectDeviceType(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad|Windows Phone/i.test(userAgent)) {
    return /iPad/i.test(userAgent) ? 'tablet' : 'mobile'
  }
  return 'desktop'
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}

function parseUTMParams(url: string) {
  const urlObj = new URL(url)
  return {
    utmSource: urlObj.searchParams.get('utm_source') || undefined,
    utmMedium: urlObj.searchParams.get('utm_medium') || undefined,
    utmCampaign: urlObj.searchParams.get('utm_campaign') || undefined,
    utmTerm: urlObj.searchParams.get('utm_term') || undefined,
    utmContent: urlObj.searchParams.get('utm_content') || undefined,
  }
}

async function getClientIP(request: Request): Promise<string | undefined> {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || undefined
}

Deno.serve(async (req) => {
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
      const visitorData: VisitorData = await req.json()
      const userAgent = req.headers.get('user-agent') || ''
      const clientIP = await getClientIP(req)
      
      // Parse UTM parameters from referrer
      const utmParams = visitorData.referrer ? parseUTMParams(visitorData.referrer) : {}

      // Get website configuration to check if tracking is enabled
      const { data: websiteConfig } = await supabase
        .from('seo_website_configs')
        .select('*')
        .eq('website_domain', visitorData.websiteDomain)
        .eq('tracking_enabled', true)
        .single()

      if (!websiteConfig) {
        return new Response(
          JSON.stringify({ error: 'Tracking not enabled for this domain' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const trackingData = {
        user_id: websiteConfig.user_id,
        website_domain: visitorData.websiteDomain,
        page_path: visitorData.pagePath,
        visitor_id: visitorData.visitorId,
        session_id: visitorData.sessionId,
        ip_address: clientIP,
        user_agent: userAgent,
        referrer: visitorData.referrer,
        utm_source: visitorData.utmSource || utmParams.utmSource,
        utm_medium: visitorData.utmMedium || utmParams.utmMedium,
        utm_campaign: visitorData.utmCampaign || utmParams.utmCampaign,
        utm_term: visitorData.utmTerm || utmParams.utmTerm,
        utm_content: visitorData.utmContent || utmParams.utmContent,
        device_type: visitorData.deviceType || detectDeviceType(userAgent),
        browser: visitorData.browser || detectBrowser(userAgent),
        os: visitorData.os || detectOS(userAgent),
        screen_resolution: visitorData.screenResolution,
        page_load_time: visitorData.pageLoadTime,
        time_on_page: visitorData.timeOnPage,
        conversion_event: visitorData.conversionEvent,
      }

      // Insert visitor analytics data
      const { error: analyticsError } = await supabase
        .from('seo_visitor_analytics')
        .insert(trackingData)

      if (analyticsError) {
        console.error('Error inserting analytics:', analyticsError)
        return new Response(
          JSON.stringify({ error: 'Failed to track visitor' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Upsert active session
      const { error: sessionError } = await supabase
        .from('seo_active_sessions')
        .upsert({
          user_id: websiteConfig.user_id,
          website_domain: visitorData.websiteDomain,
          session_id: visitorData.sessionId,
          visitor_id: visitorData.visitorId,
          current_page: visitorData.pagePath,
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'session_id'
        })

      if (sessionError) {
        console.error('Error updating session:', sessionError)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Visitor tracked successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle GET request for analytics data
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const userId = url.searchParams.get('userId')
      const websiteDomain = url.searchParams.get('websiteDomain')
      const days = parseInt(url.searchParams.get('days') || '30')

      if (!userId || !websiteDomain) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get analytics data
      const { data: analytics, error: analyticsError } = await supabase
        .from('seo_visitor_analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('website_domain', websiteDomain)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch analytics' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get active sessions
      const { data: activeSessions } = await supabase
        .from('seo_active_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('website_domain', websiteDomain)
        .eq('is_active', true)

      return new Response(
        JSON.stringify({ 
          analytics: analytics || [], 
          activeSessions: activeSessions || []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in track-visitor function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})