import React from 'react'
import styled from 'styled-components'
// type
import { SelectTagProps } from '@/components/sidebar/type'
// components
import { ImageWithSkeleton } from '@/components/skeleton'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { Cross } from '@twreporter/react-components/lib/icon'

const TagCloseIcon = styled(Cross)`
  height: 12px !important;
  width: 12px !important;
  background-color: ${colorGrayscale.gray500} !important;
`
const Box = styled.div<{
  $color: string
  $bgColor: string
  $hoverColor: string
  $hoverBgColor: string
  $hasBorder: boolean
  $cursor: string
  $withImg: boolean
}>`
  display: inline-flex;
  padding: 6px 12px 6px ${(props) => (props.$withImg ? '8px' : '12px')};
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  color: ${(props) => props.$color};
  background-color: ${(props) => props.$bgColor};
  cursor: ${(props) => props.$cursor};
  ${(props) => (props.$hasBorder ? `border: 1px solid ${props.$color};` : '')}

  &:hover {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) => props.$hoverBgColor};
    ${(props) =>
      props.$hasBorder ? `border: 1px solid ${props.$hoverColor};` : ''}

    ${TagCloseIcon} {
      background-color: ${colorGrayscale.gray800} !important;
    }
  }
`
const getStyle = (selected: boolean, withDelete: boolean, isLast: boolean) => {
  if (!selected) {
    return {
      color: colorGrayscale.gray700,
      bgColor: colorGrayscale.white,
      hoverColor: colorGrayscale.gray800,
      hoverBgColor: colorGrayscale.white,
      hasBorder: true,
      cursor: 'pointer',
    }
  }
  if (withDelete) {
    return {
      color: colorGrayscale.gray800,
      bgColor: colorGrayscale.gray100,
      hoverColor: colorGrayscale.gray800,
      hoverBgColor: colorGrayscale.gray100,
      hasBorder: false,
      cursor: isLast ? 'default' : 'pointer',
    }
  }
  return {
    color: colorGrayscale.white,
    bgColor: colorGrayscale.gray700,
    hoverColor: colorGrayscale.white,
    hoverBgColor: colorGrayscale.gray800,
    hasBorder: false,
    cursor: 'pointer',
  }
}

const SelectTag: React.FC<SelectTagProps> = ({
  name,
  count,
  avatar,
  selected = false,
  withDelete = false,
  isLast = false,
  onClick,
}) => {
  const { color, bgColor, hoverColor, hoverBgColor, hasBorder, cursor } =
    getStyle(selected, withDelete, isLast)
  return (
    <Box
      $color={color}
      $bgColor={bgColor}
      $hoverColor={hoverColor}
      $hoverBgColor={hoverBgColor}
      $hasBorder={hasBorder}
      $cursor={cursor}
      $withImg={!!avatar}
      onClick={onClick}
    >
      {avatar ? (
        <ImageWithSkeleton
          src={avatar}
          alt={`avatar of ${name}`}
          width={24}
          height={24}
        />
      ) : null}
      <P1 text={`${name}(${count ?? 0})`} />
      {withDelete && !isLast ? <TagCloseIcon /> : null}
    </Box>
  )
}

export default SelectTag
