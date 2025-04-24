import React from 'react'
import styled from 'styled-components'
// components
import { ImageWithSkeleton, CircleRaw } from '@/components/skeleton'
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
  ${(props) =>
    props.$active ? `border-bottom: 2px solid ${colorGrayscale.gray800};` : ''}
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

export type TabProps = {
  slug?: string
  name?: string
  count?: number
  avatar?: string
  selected?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}
const Tab: React.FC<TabProps> = ({
  name = '',
  count = 0,
  avatar,
  selected = false,
  onClick,
  className,
}: TabProps) => {
  return (
    <Box $active={selected} onClick={onClick} className={className}>
      {avatar ? (
        <ImageWithSkeleton
          src={avatar}
          alt={`${name} avatar on tab`}
          width={36}
          height={36}
        />
      ) : (
        <CircleRaw width={36} height={36} />
      )}
      <Name text={`${name}${count ? `(${count})` : ''}`} $active={selected} />
    </Box>
  )
}
export default Tab
