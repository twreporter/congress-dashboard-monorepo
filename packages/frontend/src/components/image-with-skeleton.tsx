'use client'

import React, { CSSProperties, SyntheticEvent, useState } from 'react'
import Image, { type ImageProps } from 'next/image'
// @twreporter
import { colorOpacity } from '@twreporter/core/lib/constants/color'

// image with skeleton component
const imageStyle: CSSProperties = {
  borderRadius: '50%',
  objectFit: 'cover',
  border: `1px solid ${colorOpacity['black_0.05']}`,
}
const gray200Base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89B8AAskB44g04okAAAAASUVORK5CYII='
const fallbackUrl = `data:image/png;base64, ${gray200Base64}`

export const ImageWithSkeleton: React.FC<ImageProps> = ({
  style = imageStyle,
  src,
  alt = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false)
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault()
    e.stopPropagation()
    setHasError(true)
  }

  return (
    <Image
      {...props}
      alt={alt}
      src={hasError ? fallbackUrl : src}
      placeholder="blur"
      blurDataURL={fallbackUrl}
      style={style}
      unoptimized={false}
      onError={handleError}
    />
  )
}

export default ImageWithSkeleton
