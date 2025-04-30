'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { LogoHeader } from '@twreporter/react-components/lib/logo'
import {
  PillButton,
  TextButton,
  IconButton,
} from '@twreporter/react-components/lib/button'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import { Hamburger, Cross } from '@twreporter/react-components/lib/icon'
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'
import { Search as SearchIcon } from '@twreporter/react-components/lib/icon'
import {
  AlgoliaInstantSearch,
  layoutVariants,
} from '@/components/search/instant-search'
import useOutsideClick from '@twreporter/react-components/lib/hook/use-outside-click'
// components
import HamburgerMenu from '@/components/hamburger-menu'
// hooks
import useWindowWidth from '@/hooks/use-window-width'
import useOutsideClick from '@/hooks/use-outside-click'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import {
  COMMON_MENU_LINKS,
  COMPACT_PILL_BUTTON_LINKS,
} from '@/constants/navigation-link'
import { HEADER_HEIGHT } from '@/constants/header'
// context
import { useScrollContext } from '@/contexts/scroll-context'

const Container = styled.header.attrs<{
  $isHidden: boolean
  $tabTop: number
}>((props) => ({
  style: {
    top: props.$isHidden
      ? `max(calc(${props.$tabTop}px - ${HEADER_HEIGHT}px), -${HEADER_HEIGHT}px)`
      : '0px',
  },
}))`
  display: flex;
  width: -webkit-fill-available;
  height: ${HEADER_HEIGHT}px;
  background-color: ${colorGrayscale.gray100};
  position: fixed;
  left: 0px;
  z-index: ${ZIndex.Header};
  transition: all 300ms ease-in-out;

  ${mq.desktopOnly`
    padding: 0 48px;
  `}
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
`
const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  ${mq.hdOnly`
    width: 1280px;
    margin: auto;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
  `}
`
const LogoContainer = styled.div`
  width: 172px;
  height: 24px;

  a,
  img {
    display: flex;
    width: 172px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`
const Button = styled.div<{
  $isHide?: boolean
}>`
  a {
    text-decoration: none;
  }
  opacity: ${(props) => (props.$isHide ? 0 : 1)};
  transition: opacity 300ms ease;
`
const HamburgerBtn = styled.div`
  width: 24px;
  height: 24px;
`
const Spacing = styled.div<{ $width?: number; $height?: number }>`
  width: ${(props) => (props.$width ? props.$width : 0)}px;
  height: ${(props) => (props.$height ? props.$height : 0)}px;
`
const SearchBox = styled.div`
  margin: 0 16px 0 24px;
  position: relative;
`
const BtnContainer = styled.div<{
  $isOpen: boolean
}>`
  opacity: ${(props) => (props.$isOpen ? '0' : '1')};
  transition: opacity 300ms ease;
`
const SearchContainer = styled.div<{
  $isOpen: boolean
}>`
  width: 360px;

  display: flex;
  align-items: center;
  gap: 8px;

  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  transition: opacity 300ms ease;
  position: absolute;
  right: 0;
  top: -8px;
`

// Constants
const menuLinks = COMMON_MENU_LINKS
const pillButtonLinks = COMPACT_PILL_BUTTON_LINKS
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Header: React.FC = () => {
  const { isHeaderHidden, tabTop } = useScrollContext()
  const windowWidth = useWindowWidth()
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const hamburgerIcon = <Hamburger releaseBranch={releaseBranch} />
  const crossIcon = <Cross releaseBranch={releaseBranch} />
  const handleHamburgerOnClick = useCallback(() => {
    setIsHamburgerOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (windowWidth >= DEFAULT_SCREEN.tablet.minWidth) {
      setIsHamburgerOpen(false)
    }
  }, [windowWidth])

  // Handle body scroll lock
  useEffect(() => {
    if (isHamburgerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isHamburgerOpen])

  // search functions
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const closeSearchBox = () => {
    setIsSearchOpen(false)
  }
  const handleClickSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSearchOpen(true)
    if (!ref.current) {
      return
    }
    const input = ref.current.getElementsByTagName(
      'INPUT'
    )[0] as HTMLInputElement
    if (input) {
      input.focus()
    }
  }
  const ref = useOutsideClick(closeSearchBox)

  return (
    <React.Fragment>
      <Container
        $isHidden={isHeaderHidden}
        $tabTop={tabTop}
        className="hidden-print"
      >
        <HeaderSection>
          <LogoContainer>
            <Link href={'https://www.twreporter.org/'} target={'_blank'}>
              <LogoHeader releaseBranch={releaseBranch} />
            </Link>
          </LogoContainer>
          <TabletAndAbove>
            <ButtonContainer>
              {menuLinks.map(({ href, text, target }, idx) => (
                <React.Fragment key={`link-btn-${idx}`}>
                  <Button $isHide={isSearchOpen}>
                    <Link href={href} target={target}>
                      <TextButton
                        text={text}
                        size={TextButton.Size.L}
                        style={TextButton.Style.DARK}
                      />
                    </Link>
                  </Button>
                  <Spacing $width={24} />
                </React.Fragment>
              ))}

              {pillButtonLinks.map(({ href, text, target, type }, idx) => (
                <React.Fragment key={`pill-btn-${idx}`}>
                  <Button $isHide={isSearchOpen}>
                    <Link href={href} target={target}>
                      <PillButton
                        text={text}
                        size={PillButton.Size.S}
                        type={type}
                      />
                    </Link>
                  </Button>
                  {idx < pillButtonLinks.length - 1 ? (
                    <Spacing $width={16} />
                  ) : null}
                </React.Fragment>
              ))}
              <SearchBox ref={ref} key="search">
                <BtnContainer
                  onClick={handleClickSearch}
                  $isOpen={isSearchOpen}
                >
                  <IconButton
                    iconComponent={<SearchIcon releaseBranch={releaseBranch} />}
                    theme={IconButton.THEME.normal}
                  />
                </BtnContainer>
                <SearchContainer $isOpen={isSearchOpen}>
                  {isSearchOpen && (
                    <>
                      <AlgoliaInstantSearch variant={layoutVariants.Header} />
                      <IconButton
                        iconComponent={crossIcon}
                        onClick={closeSearchBox}
                      />
                    </>
                  )}
                </SearchContainer>
              </SearchBox>
            </ButtonContainer>
          </TabletAndAbove>
          <MobileOnly>
            <ButtonContainer>
              {!isHamburgerOpen ? (
                <>
                  <Button>
                    <Link
                      href={pillButtonLinks[1].href}
                      target={pillButtonLinks[1].target}
                    >
                      <PillButton
                        text={pillButtonLinks[1].text}
                        size={PillButton.Size.S}
                        type={pillButtonLinks[1].type}
                      />
                    </Link>
                  </Button>
                  <Spacing $width={16} />
                </>
              ) : null}
              <HamburgerBtn>
                <IconButton
                  iconComponent={isHamburgerOpen ? crossIcon : hamburgerIcon}
                  onClick={handleHamburgerOnClick}
                />
              </HamburgerBtn>
            </ButtonContainer>
          </MobileOnly>
        </HeaderSection>
      </Container>
      <HamburgerMenu isOpen={isHamburgerOpen} />
    </React.Fragment>
  )
}

export default Header
