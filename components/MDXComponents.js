import Image from 'next/image'
import CustomLink from './Link'
import FullHeightIframe from './FullHeightIframe'

const MDXComponents = {
  Image,
  FullHeightIframe,
  a: CustomLink,
}

export default MDXComponents
