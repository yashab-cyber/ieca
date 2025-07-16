import Script from 'next/script'

interface AnalyticsProps {
  gaMeasurementId?: string
  hotjarId?: string
  clarityId?: string
}

export function Analytics({ 
  gaMeasurementId,
  hotjarId,
  clarityId
}: AnalyticsProps) {
  return (
    <>
      {/* Google Analytics - Only load if ID is provided */}
      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `}
          </Script>
        </>
      )}

      {/* Hotjar - Only load if ID is provided */}
      {hotjarId && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${hotjarId},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Microsoft Clarity - Only load if ID is provided */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  )
}

// Enhanced tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    })
  }
}

export const trackPageView = (url: string, title?: string, gaMeasurementId?: string) => {
  if (typeof window !== 'undefined' && window.gtag && gaMeasurementId) {
    window.gtag('config', gaMeasurementId, {
      page_title: title || document.title,
      page_location: url,
    })
  }
}

export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: 'INR',
    })
  }
}

// Security-focused events for IECA
export const trackSecurityEvent = (eventType: 'threat_report' | 'incident_response' | 'vulnerability_report' | 'contact_emergency', details?: Record<string, any>) => {
  trackEvent('security_interaction', {
    event_category: 'security',
    event_label: eventType,
    custom_parameters: {
      security_type: eventType,
      timestamp: new Date().toISOString(),
      ...details,
    },
  })
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
