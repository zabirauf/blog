import dynamic from 'next/dynamic';

const GoogleModelViewImport = dynamic(() => import('./GoogleModelViewImport'), {
  ssr: false,
});

export default function ModelViewer(props) {
  const { alt, src } = props;
  const style = props.style || {};

  return (
    <>
      <GoogleModelViewImport />
      <model-viewer
        alt={alt}
        src={src}
        style={style}
        ar
        ar-modes="webxr scene-viewer quick-look"
        seamless-poster
        shadow-intensity="1"
        camera-controls
      />
    </>
  );
}
