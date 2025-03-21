'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
// components
import Tab, { TabProps } from '@/components/sidebar/tab'
import { Gap } from '@/components/skeleton'
// utils
import { notoSerif } from '@/utils/font'
// @twreporter
import { H3 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { IconButton } from '@twreporter/react-components/lib/button'
import { Fullscreen, Back, More } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 0 0;
  position: sticky;
  top: 0;
  background-color: ${colorGrayscale.white};
`
const FlexRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
`
const TitleGroup = styled(FlexRow)`
  padding-left: 24px;
`
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  gap: 8px;
`
const Button = styled(IconButton)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`
const Title = styled(H3)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`
const Subtitle = styled(P2)`
  color: ${colorGrayscale.gray800};
  margin-top: 4px;
  padding-left: 24px;

  ${mq.tabletOnly`
    margin-top: 0;  
  `}
`
const TabGroup = styled(FlexRow)`
  margin-top: 12px;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};

  ${FlexRow} {
    overflow-x: scroll;
    scrollbar-width: none;
    gap: 24px;
    margin-right: 4px;
    padding-right: 24px;
    padding: 0 24px;

    ${mq.tabletOnly`
      margin-right: 0;
    `}
  }

  ${Button} {
    &:before {
      content: '';
      height: 28px;
      border-right: 1px solid ${colorGrayscale.gray300};
      position: relative;
      left: -10px;
    }
  }
`

export type TitleSectionProps = {
  link: string
  title: string
  count?: number
  subtitle?: string
  tabs?: TabProps[]
  onSelectTab?: (index: number) => void
  onClose?: () => void
}
const TitleSection: React.FC<TitleSectionProps> = ({
  link,
  title,
  count = 0,
  subtitle = '',
  tabs = [],
  onSelectTab,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const selectTab = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedTab(index)
    if (typeof onSelectTab === 'function') {
      onSelectTab(index)
    }

    const tabElement = e.currentTarget as HTMLElement
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    }
  }
  const gotoPage = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`go to ${title} page, path: ${link}`)
  }
  const closePage = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onClose === 'function') {
      onClose()
    }
  }
  const openFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`open filter modal`)
  }

  return (
    <Section>
      <TitleGroup>
        <Title text={`${title} 的相關發言摘要${count ? `(${count})` : ''}`} />
        <ButtonGroup>
          <Button
            iconComponent={<Fullscreen releaseBranch={releaseBranch} />}
            theme={IconButton.THEME.normal}
            type={IconButton.Type.PRIMARY}
            onClick={gotoPage}
          />
          <Button
            iconComponent={<Back releaseBranch={releaseBranch} />}
            theme={IconButton.THEME.normal}
            type={IconButton.Type.PRIMARY}
            onClick={closePage}
          />
        </ButtonGroup>
      </TitleGroup>
      {subtitle ? <Subtitle text={subtitle} /> : null}
      {tabs.length > 0 ? (
        <TabGroup>
          <FlexRow>
            {tabs.map((tabProps: TabProps, index: number) => (
              <Tab
                {...tabProps}
                key={`sidebar-tab-${index}`}
                selected={index === selectedTab}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  selectTab(e, index)
                }
              />
            ))}
          </FlexRow>
          <Button
            iconComponent={<More releaseBranch={releaseBranch} />}
            theme={IconButton.THEME.normal}
            type={IconButton.Type.PRIMARY}
            onClick={openFilter}
          />
        </TabGroup>
      ) : (
        <Gap $gap={16} />
      )}
    </Section>
  )
}

export default TitleSection
