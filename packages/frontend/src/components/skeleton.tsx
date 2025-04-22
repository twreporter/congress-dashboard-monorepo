import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import Image, { type ImageProps } from 'next/image'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  } 
`
export const skeletonAnimationCss = css`
  position: relative;
  overflow: hidden;
  &::after {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      ${colorGrayscale.gray100} 20%,
      ${colorGrayscale.gray200} 100%
    );
    animation: ${shimmer} 3s infinite;
    content: '';
  }
`

export const Triangle = styled.div<{ $width?: string; $height?: string }>`
  width: ${(props) => props.$width || 'auto'};
  height: ${(props) => props.$height || 'auto'};
  background: ${colorGrayscale.gray200};
  border-radius: 2px;
  max-width: 100%;
  ${skeletonAnimationCss}
`
type CircleProps = {
  width?: number
  height?: number
  className?: string
}
const CircleRaw: React.FC = ({
  width = 56,
  height = 56,
  className,
}: CircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 56 56"
    fill="none"
    className={className}
  >
    <circle cx="28" cy="28" r="28" fill={colorGrayscale.gray200} />
  </svg>
)
export const Circle = styled(CircleRaw)`
  ${skeletonAnimationCss}
`

export const Gap = styled.div<{ $gap: number }>`
  height: ${(props) => props.$gap}px;
`

export const GapHorizontal = styled.div<{ $gap: number }>`
  width: ${(props) => props.$gap}px;
`

// image with skeleton component
const imageStyle = {
  borderRadius: '50%',
}
const gray200Base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89B8AAskB44g04okAAAAASUVORK5CYII='
export const ImageWithSkeleton: React.FC<ImageProps> = (props) => {
  return (
    <Image
      {...props}
      placeholder="blur"
      blurDataURL={`data:image/png;base64, ${gray200Base64}`}
      style={imageStyle}
      unoptimized={false}
    />
  )
}
