import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface APMAlertRequest {
  alertType: 'error' | 'performance';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  errorMessage?: string;
  errorStack?: string;
  componentName?: string;
  url?: string;
  userAgent?: string;
  metricValue?: number;
  thresholdValue?: number;
  userId: string;
  userEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alertData: APMAlertRequest = await req.json();
    
    console.log("Processing APM alert:", { 
      alertType: alertData.alertType, 
      severity: alertData.severity,
      title: alertData.title 
    });

    // Only send emails for critical errors and high-severity performance issues
    if (alertData.severity !== 'critical' && 
        !(alertData.alertType === 'performance' && alertData.severity === 'error')) {
      console.log("Skipping email notification for non-critical alert");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get user details
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let userEmail = alertData.userEmail;
    let userName = 'Unknown User';

    if (!userEmail && alertData.userId) {
      const { data: profile } = await supabaseClient
        .from('user_profiles')
        .select('email, display_name')
        .eq('id', alertData.userId)
        .single();
      
      if (profile) {
        userEmail = profile.email;
        userName = profile.display_name || 'Unknown User';
      }
    }

    // Create email content based on alert type
    let emailSubject = `🚨 ${alertData.severity.toUpperCase()} APM Alert: ${alertData.title}`;
    let emailBody = '';

    if (alertData.alertType === 'error') {
      emailBody = `
        <h1>Critical Error Alert</h1>
        <p><strong>Alert:</strong> ${alertData.title}</p>
        <p><strong>Description:</strong> ${alertData.description}</p>
        <p><strong>Severity:</strong> ${alertData.severity}</p>
        
        <h2>Error Details</h2>
        <p><strong>Error Message:</strong> ${alertData.errorMessage || 'N/A'}</p>
        <p><strong>Component:</strong> ${alertData.componentName || 'N/A'}</p>
        <p><strong>URL:</strong> ${alertData.url || 'N/A'}</p>
        
        <h2>User Information</h2>
        <p><strong>User ID:</strong> ${alertData.userId}</p>
        <p><strong>User Email:</strong> ${userEmail || 'N/A'}</p>
        <p><strong>User Name:</strong> ${userName}</p>
        <p><strong>User Agent:</strong> ${alertData.userAgent || 'N/A'}</p>
        
        ${alertData.errorStack ? `
        <h2>Stack Trace</h2>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">
${alertData.errorStack}
        </pre>
        ` : ''}
        
        <p><em>Time:</em> ${new Date().toISOString()}</p>
      `;
    } else {
      emailBody = `
        <h1>Performance Alert</h1>
        <p><strong>Alert:</strong> ${alertData.title}</p>
        <p><strong>Description:</strong> ${alertData.description}</p>
        <p><strong>Severity:</strong> ${alertData.severity}</p>
        
        <h2>Performance Details</h2>
        <p><strong>Current Value:</strong> ${alertData.metricValue || 'N/A'}</p>
        <p><strong>Threshold:</strong> ${alertData.thresholdValue || 'N/A'}</p>
        <p><strong>URL:</strong> ${alertData.url || 'N/A'}</p>
        
        <h2>User Information</h2>
        <p><strong>User ID:</strong> ${alertData.userId}</p>
        <p><strong>User Email:</strong> ${userEmail || 'N/A'}</p>
        <p><strong>User Name:</strong> ${userName}</p>
        
        <p><em>Time:</em> ${new Date().toISOString()}</p>
      `;
    }

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "APM Alerts <noreply@onlinenote.ai>",
      to: ["info@onlinenote.ai"],
      subject: emailSubject,
      html: emailBody,
    });

    if (emailResponse.error) {
      console.error("Error sending APM alert email:", emailResponse.error);
      throw new Error(`Failed to send APM alert email: ${emailResponse.error}`);
    }

    console.log("APM alert email sent successfully:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-apm-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);