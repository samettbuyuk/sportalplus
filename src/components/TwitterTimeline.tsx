import { useEffect } from 'react';

interface TwitterTimelineProps {
  screenName: string;
  height?: number;
}

export default function TwitterTimeline({ screenName, height = 600 }: TwitterTimelineProps) {
  useEffect(() => {
    // Load Twitter script if it doesn't exist
    const scriptId = 'twitter-wjs';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If it exists, we might need to trigger a render
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, []);

  return (
    <div className="w-full overflow-hidden flex flex-col" style={{ height: height }}>
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme="light"
        href={`https://twitter.com/${screenName}?ref_src=twsrc%5Etfw`}
      >
        Tweets by {screenName}
      </a>
    </div>
  );
}
