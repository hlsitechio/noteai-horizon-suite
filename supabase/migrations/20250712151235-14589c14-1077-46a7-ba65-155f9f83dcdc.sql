-- Create APM tables for Application Performance Monitoring

-- Performance metrics table
CREATE TABLE public.apm_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Error tracking table
CREATE TABLE public.apm_error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  user_agent TEXT,
  url TEXT,
  is_filtered BOOLEAN DEFAULT false,
  severity TEXT DEFAULT 'error',
  tags JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance alerts table
CREATE TABLE public.apm_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  threshold_value NUMERIC,
  current_value NUMERIC,
  severity TEXT DEFAULT 'warning',
  is_acknowledged BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session performance table
CREATE TABLE public.apm_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  page_views INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  avg_load_time NUMERIC,
  bounce_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apm_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apm_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apm_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apm_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own performance metrics" 
ON public.apm_performance_metrics 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own error logs" 
ON public.apm_error_logs 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own alerts" 
ON public.apm_alerts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" 
ON public.apm_sessions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_apm_performance_metrics_user_timestamp ON public.apm_performance_metrics(user_id, timestamp DESC);
CREATE INDEX idx_apm_error_logs_user_timestamp ON public.apm_error_logs(user_id, timestamp DESC);
CREATE INDEX idx_apm_alerts_user_created ON public.apm_alerts(user_id, created_at DESC);
CREATE INDEX idx_apm_sessions_user_start ON public.apm_sessions(user_id, start_time DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_apm_alerts_updated_at
BEFORE UPDATE ON public.apm_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_apm_sessions_updated_at
BEFORE UPDATE ON public.apm_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();