import React, { memo, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'
// @twreporter
import { IconButton } from '@twreporter/react-components/lib/button'
import { Arrow, More } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { DesktopAndAbove } from '@twreporter/react-components/lib/rwd'
// components
import Tab, { type TabProps } from '@/components/sidebar/tab'

const TabGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  padding-right: 24px;
  ${mq.tabletOnly`
    padding-right: 32px;
  `}
`

const TabItem = styled.div`
  padding-left: 24px;
`

const Button = styled(IconButton)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:before {
    content: '';
    height: 28px;
    border-right: 1px solid ${colorGrayscale.gray300};
    position: relative;
    left: -10px;
  }
`

const ScrollableTab = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  scrollbar-width: none;
  width: 300px;
  flex: 1;
  ${mq.tabletAndBelow`
    padding-right: 24px;
  `}
  ${TabItem} {
    ${mq.desktopAndAbove`
      &:first-child {
        padding-left: 12px;
      }
    `}
    ${mq.tabletOnly`
      &:first-child {
        padding-left: 32px;
      }
    `}
  }
`

const ArrowButton = styled(IconButton)`
  width: 24px;
  height: 24px;
  &.left-arrow {
    margin-left: 16px;
  }
  &.right-arrow {
    margin-left: 12px;
    margin-right: 16px;
  }
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH || 'master'

interface TabNavigationProps {
  tabs: TabProps[]
  selectedTab: number
  setSelectedTab: (index: number) => void
  onFilterClick: (e: React.MouseEvent<HTMLElement>) => void
}

const TabNavigation = memo<TabNavigationProps>(
  ({ tabs, selectedTab, setSelectedTab, onFilterClick }) => {
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
      tabRefs.current = tabRefs.current.slice(0, tabs.length)
    }, [tabs])

    const scrollTabIntoView = useCallback((index: number) => {
      if (tabRefs.current[index]) {
        tabRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest',
        })
      }
    }, [])

    const selectTab = useCallback(
      (e: React.MouseEvent<HTMLElement>, index: number) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedTab(index)

        // If clicking directly on a tab, use event target
        if (e.currentTarget.classList.contains('tab-item')) {
          e.currentTarget.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest',
          })
        } else {
          // If clicking on arrows, use the ref to scroll
          scrollTabIntoView(index)
        }
      },
      [setSelectedTab, scrollTabIntoView]
    )

    return (
      <TabGroup>
        <DesktopAndAbove>
          <ArrowButton
            className="left-arrow"
            iconComponent={
              <Arrow
                releaseBranch={releaseBranch}
                direction={Arrow.Direction.LEFT}
              />
            }
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              selectTab(e, selectedTab - 1 > 0 ? selectedTab - 1 : 0)
            }
            disabled={selectedTab === 0}
          />
        </DesktopAndAbove>
        <ScrollableTab>
          {tabs.map((tabProps: TabProps, index: number) => (
            <TabItem
              className="tab-item"
              key={`sidebar-tab-${index}`}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                selectTab(e, index)
              }
            >
              <Tab {...tabProps} selected={index === selectedTab} />
            </TabItem>
          ))}
        </ScrollableTab>
        <DesktopAndAbove>
          <ArrowButton
            className="right-arrow"
            iconComponent={
              <Arrow
                releaseBranch={releaseBranch}
                direction={Arrow.Direction.RIGHT}
              />
            }
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              selectTab(
                e,
                selectedTab + 1 < tabs.length - 1
                  ? selectedTab + 1
                  : tabs.length - 1
              )
            }
            disabled={selectedTab === tabs.length - 1}
          />
        </DesktopAndAbove>
        <Button
          iconComponent={<More releaseBranch={releaseBranch} />}
          theme={IconButton.THEME.normal}
          type={IconButton.Type.PRIMARY}
          onClick={onFilterClick}
        />
      </TabGroup>
    )
  }
)

TabNavigation.displayName = 'TabNavigation'

export default TabNavigation
