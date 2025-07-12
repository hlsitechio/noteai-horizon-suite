import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportEmailRequest {
  subject: string;
  department: string;
  message: string;
  userId: string;
  workspaceId?: string;
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, department, message, userId, workspaceId, userEmail }: SupportEmailRequest = await req.json();

    console.log("Processing support ticket:", { subject, department, userId });

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the support ticket in the database
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        subject,
        department,
        message,
        status: 'open'
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Error creating support ticket:", ticketError);
      throw new Error("Failed to create support ticket");
    }

    console.log("Support ticket created:", ticket.id);

    // Send email to support team
    const emailResponse = await resend.emails.send({
      from: "Support <noreply@onlinenote.ai>",
      to: ["info@onlinenote.ai"],
      subject: `[${department}] ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Workspace ID:</strong> ${workspaceId || 'N/A'}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
        
        <h3>Message:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This support request was submitted via the OnlineNote.ai support system.
        </p>
      `,
    });

    if (emailResponse.error) {
      console.error("Error sending email:", emailResponse.error);
      throw new Error(`Failed to send support email: ${emailResponse.error}`);
    }

    console.log("Support email sent successfully:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ticketId: ticket.id,
        emailId: emailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-support-email function:", error);
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