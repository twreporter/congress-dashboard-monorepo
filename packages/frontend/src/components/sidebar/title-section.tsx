'use client'

import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { usePathname } from 'next/navigation'
// components
import Tab from '@/components/sidebar/tab'
import { Gap } from '@/components/skeleton'
// type
import type { TabProps } from '@/components/sidebar/type'
// style
import {
  FlexRow,
  TitleGroup,
  ButtonGroup,
  Title,
  TitleLink,
  TitleText,
  Button,
} from '@/components/sidebar/style'
// @twreporter
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { IconButton } from '@twreporter/react-components/lib/button'
import { Back, More } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// constants
import { InternalRoutes } from '@/constants/routes'

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
  align-items: center !important;
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
  showTabAvatar?: boolean
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
  showTabAvatar = false,
  onSelectTab,
  onClose,
  onOpenFilterModal,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabRef = useRef<HTMLDivElement>(null)
  const prevLinkRef = useRef<TitleSectionProps['link']>('')
  const pathname = usePathname()

  const titleDescription = pathname.startsWith(InternalRoutes.Council)
    ? '的相關議案摘要'
    : '的相關發言摘要'

  useEffect(() => {
    setSelectedTab(0)

    const linkChnaged = prevLinkRef.current && prevLinkRef.current !== link
    prevLinkRef.current = link

    if (tabRef.current) {
      const behavior = linkChnaged ? 'instant' : 'smooth'
      tabRef.current.scrollTo({ left: 0, behavior })
    }
  }, [link, tabs, setSelectedTab])

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
        <Title>
          <TitleLink href={link}>{title}</TitleLink>
          <TitleText>{` ${titleDescription}${
            count ? `(${count})` : ''
          }`}</TitleText>
        </Title>
        <ButtonGroup>
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
          <FlexRow ref={tabRef}>
            {tabs.map((tabProps: TabProps, index: number) => (
              <TabItem
                key={`sidebar-tab-${index}`}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  selectTab(e, index)
                }
              >
                <Tab
                  {...tabProps}
                  showAvatar={showTabAvatar}
                  selected={index === selectedTab}
                />
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
