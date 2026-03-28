import { useEffect } from 'react';

export default function ChatwayWidget() {
  useEffect(() => {
    // Prevent duplicate scripts
    if (document.getElementById('chatway')) return;

    const script = document.createElement('script');
    script.id = 'chatway';
    script.src = 'https://cdn.chatway.app/widget.js?id=bRF6Re0AMd3g';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('chatway');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}
