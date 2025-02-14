import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorOpacity } from '@twreporter/core/lib/constants/color'

export enum TagSize {
  S,
  L,
}

const Avatar = styled.img`
  margin: auto;
  display: block;
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0px ${colorOpacity['black_0.2']};
`
const Tag = styled.div<{ $size: TagSize }>`
  position: relative;

  &,
  ${Avatar} {
    width: ${(props) => (props.$size === TagSize.L ? 32 : 16)}px;
    height: ${(props) => (props.$size === TagSize.L ? 32 : 16)}px;
  }

  // outline
  svg {
    position: absolute;
    left: 0;
  }
`

type OutlineProps = {
  size?: TagSize
}
const Outline: React.FC<OutlineProps> = ({ size = TagSize.L }) => {
  const width = size === TagSize.L ? 32 : 16
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      viewBox={`0 0 ${width} ${width}`}
      fill="none"
    >
      <circle
        cx={width / 2}
        cy={width / 2}
        r={width / 2 - 0.5}
        stroke="white"
      />
    </svg>
  )
}

type PartyTagProps = {
  avatar: string
  size?: TagSize
  className?: string
}
const PartyTag: React.FC<PartyTagProps> = ({
  avatar,
  size = TagSize.L,
  className,
}) => {
  return (
    <Tag $size={size} className={className}>
      <Outline size={size} />
      <Avatar src={avatar} />
    </Tag>
  )
}

export default PartyTag
