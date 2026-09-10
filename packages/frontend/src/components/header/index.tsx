'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
import Image from 'next/image'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { PillButton, IconButton } from '@twreporter/react-components/lib/button'
import {
  DesktopAndAbove,
  TabletAndAbove,
  TabletAndBelow,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import {
  Hamburger,
  Cross,
  Member,
  KidStar,
} from '@twreporter/react-components/lib/icon'
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'
import { Search as SearchIcon } from '@twreporter/react-components/lib/icon'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import {
  AlgoliaInstantSearch,
  layoutVariants,
} from '@/components/search/instant-search'
// components
import HamburgerMenu from '@/components/hamburger-menu'
import Tabs from '@/components/header/tabs'
import MemberAvatar from '@/components/member-avatar'
// hooks
import useWindowWidth from '@/hooks/use-window-width'
import { useBodyScrollLock } from '@/hooks/use-scroll-lock'
import { useAuth } from '@/services/auth/auth-provider'
import { getLoginUrl } from '@/utils/get-login-url'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { COMPACT_PILL_BUTTON_LINKS } from '@/constants/navigation-link'
import { HEADER_HEIGHT } from '@/constants/header'
import { InternalRoutes } from '@/constants/routes'
import { MEMBER_ACCOUNT_LINKS } from '@/constants/member-account-link'
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
  width: -moz-available;
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
    margin: 0 auto;
    padding: 0 16px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
  `}
`
const LeftContainer = styled.div`
  a,
  img {
    display: flex;
    height: 24px;
    justify-content: center;
    align-items: center;
    ${mq.mobileOnly`
      height: 20px;
    `}
  }
`
const RightContainer = styled.div`
  display: flex;
  gap: 24px;
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
  position: relative;
`
const BtnContainer = styled.div<{
  $isOpen: boolean
}>`
  opacity: ${(props) => (props.$isOpen ? '0' : '1')};
  pointer-events: ${(props) => (props.$isOpen ? 'none' : 'auto')};
  transition: opacity 300ms ease;
`

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`

const AccountContainer = styled.div`
  position: relative;
`

const AccountButton = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

const AccountMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 240px;
  background: ${colorGrayscale.white};
  border-radius: 8px;
  border: 1px solid ${colorGrayscale.gray300};
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
`

const AccountEmail = styled(P3)`
  overflow: hidden;
  color: ${colorGrayscale.gray600};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AccountIdentity = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
`

const AccountIdentityText = styled.div`
  min-width: 0;
`

const AccountName = styled(P2)`
  overflow: hidden;
  color: ${colorGrayscale.gray800};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const AccountDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${colorGrayscale.gray200};
`

const AccountMenuItem = styled.button`
  width: 100%;
  padding: 12px 20px;
  color: ${colorGrayscale.gray800};
  cursor: pointer;
  border: 0;
  background: transparent;
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
const pillButtonLinks = COMPACT_PILL_BUTTON_LINKS
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const logoSrcPrefix = 'https://www.twreporter.org/images/lawmaker'

const Header: React.FC = () => {
  const { isHeaderHidden, tabTop } = useScrollContext()
  const { name, email, status: authStatus, logout } = useAuth()
  const windowWidth = useWindowWidth()
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const hamburgerIcon = <Hamburger releaseBranch={releaseBranch} />
  const crossIcon = <Cross releaseBranch={releaseBranch} />
  const memberIcon = <Member releaseBranch={releaseBranch} />
  const kidStarIcon = <KidStar releaseBranch={releaseBranch} />
  const handleHamburgerOnClick = useCallback(() => {
    setIsAccountOpen(false)
    setIsHamburgerOpen((prev) => !prev)
  }, [])

  const handleAccountClick = () => {
    if (authStatus === 'authenticated') {
      setIsAccountOpen((previous) => !previous)
      return
    }
    window.location.href = getLoginUrl()
  }

  const desktopAccountControl =
    authStatus === 'authenticated' ? (
      <AccountButton
        type="button"
        aria-label="會員選單"
        aria-expanded={isAccountOpen}
        onClick={handleAccountClick}
      >
        <MemberAvatar name={name} email={email} />
      </AccountButton>
    ) : (
      <IconButton iconComponent={memberIcon} onClick={handleAccountClick} />
    )

  const handleLogout = async () => {
    await logout()
    setIsAccountOpen(false)
  }

  // Handle body scroll lock
  useBodyScrollLock({
    toLock: isHamburgerOpen,
    lockID: 'hambuger',
  })

  useEffect(() => {
    if (windowWidth >= DEFAULT_SCREEN.tablet.minWidth) {
      setIsHamburgerOpen(false)
    }
  }, [windowWidth])

  // search functions
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const closeSearchBox = () => {
    setIsSearchOpen(false)
  }
  const handleClickSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSearchOpen(true)
  }

  return (
    <React.Fragment>
      <Container
        $isHidden={isHeaderHidden}
        $tabTop={tabTop}
        className="hidden-print"
      >
        <HeaderSection>
          <LeftContainer>
            <Link href={'/'} target={'_self'}>
              <TabletAndAbove>
                <Image
                  src={`${logoSrcPrefix}/logo_L.svg`}
                  alt="Twreporter Lawmaker Logo"
                  priority
                  width={180}
                  height={20}
                />
              </TabletAndAbove>
              <MobileOnly>
                <Image
                  src={`${logoSrcPrefix}/logo_S.svg`}
                  alt="Twreporter Lawmaker Logo"
                  priority
                  width={147}
                  height={20}
                />
              </MobileOnly>
            </Link>
          </LeftContainer>
          <DesktopAndAbove>
            <RightContainer>
              <Tabs />
              <ButtonContainer>
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
              </ButtonContainer>
              <IconsContainer>
                <SearchBox key="search">
                  <BtnContainer
                    onClick={handleClickSearch}
                    $isOpen={isSearchOpen}
                  >
                    <IconButton
                      iconComponent={
                        <SearchIcon releaseBranch={releaseBranch} />
                      }
                      theme={IconButton.THEME.normal}
                    />
                  </BtnContainer>
                  <SearchContainer $isOpen={isSearchOpen}>
                    {isSearchOpen && (
                      <>
                        <AlgoliaInstantSearch
                          variant={layoutVariants.Header}
                          autoFocus={isSearchOpen}
                          onModalClose={closeSearchBox}
                        />
                        <IconButton
                          iconComponent={crossIcon}
                          onClick={closeSearchBox}
                        />
                      </>
                    )}
                  </SearchContainer>
                </SearchBox>
                <IconButton
                  iconComponent={kidStarIcon}
                  onClick={() =>
                    (window.location.href = InternalRoutes.Favorites)
                  }
                />
                <AccountContainer>
                  {desktopAccountControl}
                  {isAccountOpen && (
                    <AccountMenu>
                      <AccountIdentity>
                        <MemberAvatar name={name} email={email} size={40} />
                        <AccountIdentityText>
                          {name && (
                            <AccountName text={name} weight={P2.Weight.BOLD} />
                          )}
                          {email && <AccountEmail text={email} />}
                        </AccountIdentityText>
                      </AccountIdentity>
                      <AccountDivider />
                      {MEMBER_ACCOUNT_LINKS.map(({ href, label }) => (
                        <AccountMenuItem
                          key={href}
                          type="button"
                          onClick={() => (window.location.href = href)}
                        >
                          <P2 text={label} />
                        </AccountMenuItem>
                      ))}
                      <AccountDivider />
                      <AccountMenuItem type="button" onClick={handleLogout}>
                        <P2 text={'登出'} />
                      </AccountMenuItem>
                    </AccountMenu>
                  )}
                </AccountContainer>
              </IconsContainer>
            </RightContainer>
          </DesktopAndAbove>
          <TabletAndBelow>
            <IconsContainer>
              <SearchBox key="search">
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
                      <AlgoliaInstantSearch
                        variant={layoutVariants.Header}
                        autoFocus={isSearchOpen}
                        onModalClose={closeSearchBox}
                      />
                      <IconButton
                        iconComponent={crossIcon}
                        onClick={closeSearchBox}
                      />
                    </>
                  )}
                </SearchContainer>
              </SearchBox>
              <HamburgerBtn>
                <IconButton
                  iconComponent={isHamburgerOpen ? crossIcon : hamburgerIcon}
                  onClick={handleHamburgerOnClick}
                />
              </HamburgerBtn>
            </IconsContainer>
          </TabletAndBelow>
        </HeaderSection>
      </Container>
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
      />
    </React.Fragment>
  )
}

export default Header
