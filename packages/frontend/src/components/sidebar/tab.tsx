import React from 'react'
import styled, { css } from 'styled-components'
// components
import { Circle } from '@/components/skeleton'
// twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Name = styled(H5)<{ $active: boolean }>`
  color: ${(props) =>
    props.$active ? colorGrayscale.gray800 : colorGrayscale.gray400};
`
const Box = styled.div<{ $active: boolean }>`
  width: fit-content;
  display: flex;
  align-items: center;
  border-bottom: 2px solid
    ${(props) =>
      props.$active ? colorGrayscale.gray800 : colorGrayscale.gray400};
  padding: 12px 0;
  gap: 10px;
  cursor: pointer;
  flex-wrap: nowrap;
  white-space: nowrap;

  ${mq.desktopAndAbove`
    &:hover {
      border-bottom: 2px solid ${colorBrand.heavy};
      ${Name} {
        color: ${colorBrand.heavy};
      }
    }
  `}
`
const ImageBox = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`
const imageCss = css`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
`
const Image = styled.img`
  z-index: 2;
  ${imageCss}
`
const ImageSkeleton = styled(Circle)`
  z-index: 1;
  ${imageCss}
`

type ImageProps = {
  src: string
}
const ImageWithSkeleton: React.FC<ImageProps> = ({ src }: ImageProps) => (
  <ImageBox>
    <ImageSkeleton />
    <Image src={src} />
  </ImageBox>
)

export type TabProps = {
  slug?: string
  name: string
  count?: number
  imageLink?: string
  selected?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}
const Tab: React.FC<TabProps> = ({
  name,
  count = 0,
  imageLink,
  selected = false,
  onClick,
}: TabProps) => {
  return (
    <Box $active={selected} onClick={onClick}>
      {imageLink ? <ImageWithSkeleton src={imageLink} /> : null}
      <Name text={`${name}${count ? `(${count})` : ''}`} $active={selected} />
    </Box>
  )
}
export default Tab
