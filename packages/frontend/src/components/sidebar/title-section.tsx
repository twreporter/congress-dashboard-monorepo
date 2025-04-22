'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
// components
import Tab, { type TabProps } from '@/components/sidebar/tab'
import { Gap } from '@/components/skeleton'
// style
import {
  FlexRow,
  TitleGroup,
  ButtonGroup,
  Title,
  Button,
} from '@/components/sidebar/style'
// @twreporter
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
const Subtitle = styled(P2)`
  color: ${colorGrayscale.gray800};
  margin-top: 4px;
  padding-left: 24px;

  ${mq.tabletOnly`
    margin-top: 0;  
  `}
`
const TabItem = styled.div``
const TabGroup = styled(FlexRow)`
  margin-top: 12px;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};

  ${FlexRow} {
    overflow-x: scroll;
    scrollbar-width: none;
    padding-right: 24px;

    ${mq.tabletOnly`
      margin-right: 0;
    `}
  }

  ${TabItem} {
    padding-left: 24px;
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
  onOpenFilterModal?: () => void
}
const TitleSection: React.FC<TitleSectionProps> = ({
  link,
  title,
  count = 0,
  subtitle = '',
  tabs = [],
  onSelectTab,
  onClose,
  onOpenFilterModal,
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
    if (typeof onOpenFilterModal === 'function') {
      onOpenFilterModal()
    }
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
              <TabItem
                key={`sidebar-tab-${index}`}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  selectTab(e, index)
                }
              >
                <Tab {...tabProps} selected={index === selectedTab} />
              </TabItem>
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
