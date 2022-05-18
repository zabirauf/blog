import { useEffect } from 'react';

export default function GoogleModelViewImport() {
  useEffect(() => {
    import('@google/model-viewer');
  });

  return null;
}
