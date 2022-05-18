import { useRef, useCallback, useState } from 'react';
import Spinner from './Spinner';

const TIME_BETWEEN_CHECKS_MS = 1000;
const MAX_TIME_SINCE_IDLE_MS = 10000;

export default function FullHeightIframe(props) {
  const { src } = props;

  const iframeRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const onLoaded = useCallback(() => {
    let timeLastUpdated = Date.now();
    let timeLastChecked = Date.now() - TIME_BETWEEN_CHECKS_MS; // As we want the first time to run
    const iframeWindow = iframeRef.current.contentWindow;

    const onRequestAnimationFrame = () => {
      const time = Date.now();
      const timeSinceLastChecked = time - timeLastChecked;
      if (timeSinceLastChecked < TIME_BETWEEN_CHECKS_MS) {
        // We don't want to check on each request frame but wait in between.
        // If its till under the limit then request callback for another animation frame.
        iframeWindow.requestAnimationFrame(onRequestAnimationFrame);
        return;
      }

      timeLastChecked = time;

      const timeSinceLastUpdated = time - timeLastUpdated;
      if (timeSinceLastUpdated >= MAX_TIME_SINCE_IDLE_MS) {
        // If we have not updated height, then things are stable so we
        // should be done.
        return;
      }

      // Find the latest height
      const doc = iframeRef.current.contentDocument;
      const body = doc.body,
        html = doc.documentElement;
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      const newHeight = `${height}px`;
      if (iframeRef.current.style.height !== newHeight) {
        // Update the height if its not the same as the current one
        iframeRef.current.style.height = newHeight;
        timeLastUpdated = time;
      }

      // Lets request again so if the height changes we can react to it
      iframeWindow.requestAnimationFrame(onRequestAnimationFrame);
    };

    // Show the iframe so that user can start seeing.
    setHasLoaded(true);

    iframeWindow.requestAnimationFrame(onRequestAnimationFrame);
  }, []);

  // Give time before first so things are rendered
  const onIframeLoaded = useCallback(() => setTimeout(onLoaded, 1000), [onLoaded]);

  return (
    <>
      {!hasLoaded && (
        <div className="flex justify-items-center">
          <Spinner />
        </div>
      )}
      <iframe
        title="Notebook"
        className={!hasLoaded ? 'invisible' : 'bg-white'}
        ref={iframeRef}
        onLoad={onIframeLoaded}
        src={src}
        width="100%"
        height="100%"
      />
    </>
  );
}
