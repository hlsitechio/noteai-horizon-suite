// JavaScript widget for visitor tracking

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const widgetCode = `
(function(window, document) {
  'use strict';

  var OnlineNoteTracker = {
    config: {
      domain: null,
      trackPageViews: true,
      trackEvents: true,
      trackSessions: true,
      apiUrl: 'https://ubxtmbgvibtjtjggjnjm.supabase.co/functions/v1/track-visitor'
    },

    init: function(options) {
      this.config = Object.assign(this.config, options);
      this.visitorId = this.getVisitorId();
      this.sessionId = this.getSessionId();
      
      if (this.config.trackPageViews) {
        this.trackPageView();
      }
      
      if (this.config.trackSessions) {
        this.trackSession();
      }
      
      this.setupEventListeners();
    },

    getVisitorId: function() {
      var visitorId = localStorage.getItem('on_visitor_id');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('on_visitor_id', visitorId);
      }
      return visitorId;
    },

    getSessionId: function() {
      var sessionId = sessionStorage.getItem('on_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        sessionStorage.setItem('on_session_id', sessionId);
      }
      return sessionId;
    },

    getDeviceInfo: function() {
      var userAgent = navigator.userAgent;
      var deviceType = 'desktop';
      
      if (/Mobile|Android|iPhone|iPad|Windows Phone/i.test(userAgent)) {
        deviceType = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
      }
      
      return {
        deviceType: deviceType,
        screenResolution: screen.width + 'x' + screen.height,
        userAgent: userAgent
      };
    },

    getUTMParams: function() {
      var params = new URLSearchParams(window.location.search);
      return {
        utmSource: params.get('utm_source'),
        utmMedium: params.get('utm_medium'),
        utmCampaign: params.get('utm_campaign'),
        utmTerm: params.get('utm_term'),
        utmContent: params.get('utm_content')
      };
    },

    trackPageView: function() {
      var startTime = Date.now();
      var deviceInfo = this.getDeviceInfo();
      var utmParams = this.getUTMParams();
      
      var data = {
        websiteDomain: this.config.domain,
        pagePath: window.location.pathname,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        referrer: document.referrer,
        screenResolution: deviceInfo.screenResolution,
        deviceType: deviceInfo.deviceType,
        pageLoadTime: Date.now() - startTime,
        utmSource: utmParams.utmSource,
        utmMedium: utmParams.utmMedium,
        utmCampaign: utmParams.utmCampaign,
        utmTerm: utmParams.utmTerm,
        utmContent: utmParams.utmContent
      };

      this.sendData(data);
      this.trackTimeOnPage(startTime);
    },

    trackTimeOnPage: function(startTime) {
      var self = this;
      
      window.addEventListener('pagehide', function() {
        var timeOnPage = Math.round((Date.now() - startTime) / 1000);
        var data = {
          websiteDomain: self.config.domain,
          pagePath: window.location.pathname,
          visitorId: self.visitorId,
          sessionId: self.sessionId,
          timeOnPage: timeOnPage
        };
        
        navigator.sendBeacon(self.config.apiUrl, JSON.stringify(data));
      });
    },

    trackSession: function() {
      // Update session activity every 30 seconds
      var self = this;
      setInterval(function() {
        self.updateSession();
      }, 30000);
    },

    updateSession: function() {
      var data = {
        websiteDomain: this.config.domain,
        pagePath: window.location.pathname,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        sessionUpdate: true
      };
      
      this.sendData(data);
    },

    trackEvent: function(eventName, eventData) {
      var data = {
        websiteDomain: this.config.domain,
        pagePath: window.location.pathname,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        conversionEvent: eventName,
        eventData: eventData
      };
      
      this.sendData(data);
    },

    setupEventListeners: function() {
      var self = this;
      
      // Track clicks on important elements
      document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          self.trackEvent('click', {
            element: e.target.tagName,
            text: e.target.textContent.substring(0, 100),
            href: e.target.href || null
          });
        }
      });
      
      // Track form submissions
      document.addEventListener('submit', function(e) {
        self.trackEvent('form_submit', {
          formId: e.target.id || null,
          formClass: e.target.className || null
        });
      });
    },

    sendData: function(data) {
      fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(function(error) {
        console.error('OnlineNote Tracker Error:', error);
      });
    }
  };

  // Expose OnlineNoteTracker globally
  window.OnlineNoteTracker = OnlineNoteTracker;

})(window, document);
`;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(widgetCode, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  }

  return new Response('Method not allowed', {
    status: 405,
    headers: corsHeaders,
  });
});