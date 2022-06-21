import Image from 'next/image';
import CustomLink from './Link';
import FullHeightIframe, { ObservableHQFullHeightIframe } from './FullHeightIframe';
import ModelViewer from './ModelViewer';

const MDXComponents = {
  Image,
  FullHeightIframe,
  ModelViewer,
  ObservableHQFullHeightIframe,
  a: CustomLink,
};

export default MDXComponents;
