import { useEffect } from 'react';

interface TwitterTimelineProps {
  screenName: string;
  height?: number;
}

export default function TwitterTimeline({ screenName, height = 600 }: TwitterTimelineProps) {
  useEffect(() => {
    const scriptId = 'twitter-wjs';
    const initTwitter = () => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = initTwitter;
      document.body.appendChild(script);
    } else {
      initTwitter();
    }
  }, [screenName]);

  return (
    <div className="w-full overflow-hidden flex flex-col bg-white" style={{ height }}>
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        data-chrome="noheader nofooter transparent"
        href={`https://twitter.com/${screenName}?ref_src=twsrc%5Etfw`}
      >
        Sportal+ Twitter Akışı Yükleniyor...
      </a>
    </div>
  );
}
