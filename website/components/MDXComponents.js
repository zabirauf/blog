import Image from 'next/image'
import CustomLink from './Link'
import FullHeightIframe from './FullHeightIframe'
import ModelViewer from './ModelViewer'

const MDXComponents = {
  Image,
  FullHeightIframe,
  ModelViewer,
  a: CustomLink,
}

export default MDXComponents
