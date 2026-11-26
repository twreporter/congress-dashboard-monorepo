'use client'

import React from 'react'
import styled, { css } from 'styled-components'
import { usePathname } from 'next/navigation'
// config
import { getOpenConfig } from '@/components/open/config'
// utils
import { notoSerif } from '@/utils/font'
// components
import { AlgoliaInstantSearch } from '@/components/search/instant-search'
import Selected from '@/components/open/selected'
import Badge from '@/components/open/badge'
// type
import type { EditorSelect } from '@/types/editor-pick'
// constants
import { InternalRoutes } from '@/constants/routes'
import { EDITOR_SELECT_TYPE } from '@/constants/editor-pick'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import {
  MobileOnly,
  TabletAndAbove,
} from '@twreporter/react-components/lib/rwd'

const Box = styled.div<{ $backgroundImage?: string }>`
  width: -webkit-fill-available;
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colorGrayscale.gray200};
  ${(props) =>
    props.$backgroundImage
      ? css`
          background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.6) 0%,
              rgba(0, 0, 0, 0.6) 100%
            ),
            url(${props.$backgroundImage}) lightgray center / cover no-repeat;
        `
      : ''}

  ${mq.tabletOnly`
    padding: 56px 0;
  `}
  ${mq.mobileOnly`
    padding: 40px 24px;  
  `}
`
const Title = styled.div<{ $textColor: string }>`
  font-size: 48px;
  text-align: center;
  color: ${(props) => props.$textColor};

  ${mq.tabletOnly`
    font-size: 36px;  
  `}
  ${mq.mobileOnly`
    font-size: 28px;  
  `}
`
const descriptionCss = css<{ $textColor: string }>`
  color: ${(props) => props.$textColor};
  margin-top: 24px;
  margin-bottom: 48px;
  text-align: center;
`
const Description = styled(TabletAndAbove)`
  ${descriptionCss}

  ${mq.tabletOnly`
    margin-top: 16px;
    margin-bottom: 40px;
  `}
`
const MobileDescription = styled(MobileOnly)`
  ${descriptionCss}
  margin-top: 16px;
  margin-bottom: 32px;
`
const SerifH4 = styled(H4)`
  // override H4 font-family
  font-family: ${notoSerif.style.fontFamily}!important;
`
const StyledSelected = styled(Selected)<{ $textColor: string }>`
  margin-top: 24px;

  div {
    color: ${(props) => props.$textColor};
  }

  ${mq.mobileOnly`
    margin-top: 16px;
  `}
`

const InstantSearchContainer = styled.div`
  ${mq.desktopAndAbove`
    width: 560px;
  `}

  ${mq.tabletOnly`
    width: 480px;
  `}

  ${mq.mobileOnly`
    width: 100%;
    max-width: 480px;
  `}
`

const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  ${mq.desktopAndAbove`
    margin-bottom: 16px;
  `}
  ${mq.tabletAndBelow`
    margin-bottom: 8px;
  `}
`

type OpenProps = {
  selecteds?: EditorSelect[]
}
const Open: React.FC<OpenProps> = ({ selecteds }) => {
  const pathname = usePathname()
  const { title, description, badge, backgroundImage, textColor } =
    getOpenConfig(pathname)

  const descriptJSX = description.map((text, index) => (
    <SerifH4 text={text} key={`open-desc-${index}`} />
  ))
  const selectedsWithPath = selecteds?.map(({ label, order, type, slug }) => {
    const pathFrom =
      type === EDITOR_SELECT_TYPE.legislator
        ? InternalRoutes.Legislator
        : InternalRoutes.Topic
    return {
      label,
      order,
      path: `${pathFrom}/${slug}`,
    }
  })
  return (
    <Box $backgroundImage={backgroundImage}>
      {badge ? (
        <BadgeContainer>
          <Badge
            text={badge.text}
            textColor={badge.textColor}
            backgroundColor={badge.backgroundColor}
          />
        </BadgeContainer>
      ) : null}
      <Title className={notoSerif.className} $textColor={textColor}>
        {title}
      </Title>
      <Description $textColor={textColor}>{descriptJSX}</Description>
      <MobileDescription $textColor={textColor}>
        <SerifH4 text={description} />
      </MobileDescription>
      <InstantSearchContainer>
        <AlgoliaInstantSearch />
      </InstantSearchContainer>
      <StyledSelected selecteds={selectedsWithPath} $textColor={textColor} />
    </Box>
  )
}

export default Open
