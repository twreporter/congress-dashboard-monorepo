'use client'
import React from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
// type
import type { NavigationLink } from '@/types/navigation-link'

export enum TextSize {
  S,
  L,
}

const StyledLink = styled(Link)<{ $size: TextSize }>`
  color: ${colorGrayscale.gray600};
  text-decoration: ${(props) =>
    props.$size === TextSize.L ? 'none' : 'underline'};
  text-decoration-color: ${colorGrayscale.gray600};
  text-underline-offset: 4px;

  &:hover {
    color: ${(props) =>
      props.$size === TextSize.L ? colorGrayscale.gray800 : ''};
  }
`

type FooterLinkProps = {
  size?: TextSize
} & NavigationLink

const FooterLink: React.FC<FooterLinkProps> = ({
  text,
  href,
  target,
  size = TextSize.L,
}) => {
  const TextComponent = size === TextSize.L ? P2 : P3
  return (
    <StyledLink $size={size} href={href} target={target}>
      <TextComponent text={text} />
    </StyledLink>
  )
}

export default FooterLink
