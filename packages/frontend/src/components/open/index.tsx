'use client'

import React from 'react'
import styled, { css } from 'styled-components'
// config
import { title, description } from '@/components/open/config'
// utils
import { notoSerif } from '@/utils/font'
// components
import { AlgoliaInstantSearch } from '@/components/search/instant-search'
import Selected from '@/components/open/selected'
// type
import {
  type EditorSelect,
  EditorSelectType,
} from '@/fetchers/server/editor-pickor'
// constants
import { InternalRoutes } from '@/constants/routes'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import {
  MobileOnly,
  TabletAndAbove,
} from '@twreporter/react-components/lib/rwd'

const Box = styled.div`
  width: -webkit-fill-available;
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colorGrayscale.gray200};

  ${mq.tabletOnly`
    padding: 56px 0;
  `}
  ${mq.mobileOnly`
    padding: 40px 24px;  
  `}
`
const Title = styled.div`
  font-size: 48px;
  text-align: center;
  color: ${colorGrayscale.gray900};

  ${mq.tabletOnly`
    font-size: 36px;  
  `}
  ${mq.mobileOnly`
    font-size: 28px;  
  `}
`
const descriptionCss = css`
  color: ${colorGrayscale.gray900};
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
const StyledSelected = styled(Selected)`
  margin-top: 24px;

  ${mq.mobileOnly`
    margin-top: 16px;
  `}
`

type OpenProps = {
  selecteds: EditorSelect[]
}
const Open: React.FC<OpenProps> = ({ selecteds }) => {
  const descriptJSX = description.map((text, index) => (
    <SerifH4 text={text} key={`open-desc-${index}`} />
  ))
  const selectedsWithPath = selecteds.map(({ label, order, type, slug }) => {
    const pathFrom =
      type === EditorSelectType.Legislator
        ? InternalRoutes.Legislator
        : InternalRoutes.Topic
    return {
      label,
      order,
      path: `${pathFrom}/${slug}`,
    }
  })
  return (
    <Box>
      <Title className={notoSerif.className}>{title}</Title>
      <Description>{descriptJSX}</Description>
      <MobileDescription>
        <SerifH4 text={description} />
      </MobileDescription>
      <AlgoliaInstantSearch />
      <StyledSelected selecteds={selectedsWithPath} />
    </Box>
  )
}

export default Open
