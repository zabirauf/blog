import { useRef, useCallback, useState } from 'react'
import Spinner from './Spinner'

export default function FullHeightIframe(props) {
  const { src } = props

  const iframeRef = useRef(null)
  const hasChangedHeight = useRef(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const onLoaded = useCallback(() => {
    setTimeout(() => {
      const doc = iframeRef.current.contentDocument
      const body = doc.body,
        html = doc.documentElement
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      console.log('Height is', height)
      console.log(
        'Various heights',
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      if (hasChangedHeight.current) {
        return
      }

      iframeRef.current.style.height = `${height + 4}px`
      hasChangedHeight.current = true
      setHasLoaded(true)
    }, 1000)
  }, [])

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
        onLoad={onLoaded}
        src={src}
        width="100%"
        height="100%"
      />
    </>
  )
}
