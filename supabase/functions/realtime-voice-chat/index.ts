import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    console.log('WebSocket connection established');
    
    // OpenAI Realtime API connection
    let openAISocket: WebSocket | null = null;
    
    const connectToOpenAI = () => {
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        console.error('OPENAI_API_KEY not configured');
        socket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI API key not configured'
        }));
        return;
      }

      console.log('Connecting to OpenAI Realtime API...');
      
      openAISocket = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        {
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        }
      );

      openAISocket.onopen = () => {
        console.log('Connected to OpenAI Realtime API');
        socket.send(JSON.stringify({
          type: 'session.created'
        }));
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('OpenAI message:', data.type);
          
          // Forward relevant messages to client
          switch (data.type) {
            case 'session.created':
            case 'session.updated':
            case 'response.created':
            case 'response.done':
            case 'response.audio.delta':
            case 'response.audio.done':
            case 'response.audio_transcript.delta':
            case 'response.audio_transcript.done':
            case 'input_audio_buffer.speech_started':
            case 'input_audio_buffer.speech_stopped':
            case 'error':
              socket.send(event.data);
              break;
            default:
              console.log('Unhandled OpenAI message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing OpenAI message:', error);
        }
      };

      openAISocket.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection error'
        }));
      };

      openAISocket.onclose = (event) => {
        console.log('OpenAI WebSocket closed:', event.code, event.reason);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection closed'
        }));
      };
    };

    socket.onopen = () => {
      console.log('Client WebSocket opened');
      connectToOpenAI();
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Client message:', message.type);
        
        // Forward client messages to OpenAI
        if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
          openAISocket.send(event.data);
        } else {
          console.error('OpenAI socket not ready');
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Not connected to OpenAI'
          }));
        }
      } catch (error) {
        console.error('Error parsing client message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Invalid message format'
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed');
      if (openAISocket) {
        openAISocket.close();
      }
    };

    return response;

  } catch (error) {
    console.error('Error setting up WebSocket:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to establish WebSocket connection' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});