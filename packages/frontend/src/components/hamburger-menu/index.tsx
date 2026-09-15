'use client'
import React, { useState } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// @twreporter
import { MenuButton, PillButton } from '@twreporter/react-components/lib/button'
import Divider from '@twreporter/react-components/lib/divider'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  AlgoliaInstantSearch,
  layoutVariants,
} from '@/components/search/instant-search'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { PILL_BUTTON_LINKS } from '@/constants/navigation-link'
import { HEADER_HEIGHT } from '@/constants/header'
import { InternalRoutes } from '@/constants/routes'
import { VALID_COUNCILS } from '@/constants/council'
// utils
import { getOptions } from '@/components/header/utils'
import { openFeedback } from '@/utils/feedback'
import { getLoginUrl } from '@/utils/get-login-url'
import { useAuth } from '@/services/auth/auth-provider'
// components
import DropdownMenu from '@/components/hamburger-menu/dropdown-menu'
import MemberAccountLinks from '@/components/member-account-links'
import MemberAvatar from '@/components/member-avatar'

const Container = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${HEADER_HEIGHT}px);
  background-color: white;
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  left: -100%;
  z-index: ${ZIndex.HamburgerMenu};
  padding: 16px 32px 0px 32px;
  transition: transform 300ms ease-in-out;
  transform: translateX(${(props) => (props.$isOpen ? '100%' : '-100%')});
  overflow: scroll;
`

const DividerContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`

const Title2 = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  color: ${colorGrayscale.gray600};
  a {
    color: ${colorGrayscale.gray600};
    text-decoration: none;
  }
`

const PillButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding-top: 24px;
  padding-bottom: 32px;
  gap: 16px;
  a {
    text-decoration: none;
  }
`

const StyledPillButton = styled(PillButton)`
  width: auto !important;
  justify-content: center;
`

const SearchSection = styled.div`
  padding: 16px 0;
`

const MemberIdentity = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 8px 0 16px;
`

const MemberEmail = styled(P3)`
  overflow: hidden;
  color: ${colorGrayscale.gray600};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MemberText = styled.div`
  min-width: 0;
`

const MemberName = styled(P2)`
  overflow: hidden;
  color: ${colorGrayscale.gray800};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const pillButtonLinks = PILL_BUTTON_LINKS

type HamburgerMenuProps = {
  isOpen: boolean
  onClose: () => void
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const { name, email, status: authStatus, logout } = useAuth()
  const [isDropdownActive, setIsDropdownActive] = useState(false)
  const handleDropdownClick = () => {
    setIsDropdownActive(!isDropdownActive)
  }

  // just for six main cities currently
  const options = getOptions(VALID_COUNCILS)

  return (
    <Container $isOpen={isOpen}>
      <SearchSection>
        <AlgoliaInstantSearch variant={layoutVariants.Menu} />
      </SearchSection>
      {authStatus === 'authenticated' ? (
        <>
          <MemberIdentity>
            <MemberAvatar name={name} email={email} size={40} />
            <MemberText>
              {name && <MemberName weight={P2.Weight.BOLD} text={name} />}
              {email && <MemberEmail text={email} />}
            </MemberText>
          </MemberIdentity>
          <DividerContainer>
            <Divider />
          </DividerContainer>
        </>
      ) : null}
      <MenuButton
        paddingLeft={0}
        paddingRight={0}
        fontWeight={MenuButton.FontWeight.BOLD}
        text={'立法院'}
        link={{ to: InternalRoutes.Home, target: '_self' }}
        onClick={onClose}
      />
      <DropdownMenu
        label="六都議會" // just for six main cities currently
        options={options}
        onClick={handleDropdownClick}
        isActive={isDropdownActive}
        currentValue={pathname || ''}
        onOptionClick={onClose}
      />
      <MenuButton
        paddingLeft={0}
        paddingRight={0}
        fontWeight={MenuButton.FontWeight.BOLD}
        text={'關於觀測站'}
        link={{ to: InternalRoutes.About, target: '_self' }}
        onClick={onClose}
      />
      <DividerContainer>
        <Divider />
      </DividerContainer>
      <MenuButton
        paddingLeft={0}
        paddingRight={0}
        fontWeight={MenuButton.FontWeight.BOLD}
        text={'我的收藏'}
        link={{ to: InternalRoutes.Favorites, target: '_self' }}
        onClick={onClose}
      />
      <DividerContainer>
        <Divider />
      </DividerContainer>
      {authStatus === 'authenticated' ? (
        <>
          <MemberAccountLinks onNavigate={onClose} showIcon={true} />
          <DividerContainer>
            <Divider />
          </DividerContainer>
        </>
      ) : null}
      <Title2 onClick={() => openFeedback('hamburger-menu')}>
        <P2 text={'意見回饋'} />
      </Title2>
      <Title2>
        <Link
          href={`${InternalRoutes.About}#「報導者觀測站」涵蓋多少資料？更新頻率為何？會再加入其他資料？`}
          target={'_blank'}
        >
          <P2 text={'資料更新說明'} />
        </Link>
      </Title2>
      {authStatus === 'authenticated' ? (
        <>
          <DividerContainer>
            <Divider />
          </DividerContainer>
          <Title2>
            <P2
              text={'登出'}
              onClick={async () => {
                await logout()
                onClose()
              }}
            />
          </Title2>
        </>
      ) : null}
      <PillButtonsContainer>
        {authStatus === 'authenticated' ? null : (
          <Link href={getLoginUrl()} target="_self" onClick={onClose}>
            <StyledPillButton
              size={PillButton.Size.L}
              type={PillButton.Type.SECONDARY}
              text={'登入／註冊'}
            />
          </Link>
        )}
        {pillButtonLinks.map(({ text, href, target, type }, idx) => (
          <Link
            key={`pill-btn-${idx}`}
            href={href}
            target={target}
            onClick={onClose}
          >
            <StyledPillButton
              size={PillButton.Size.L}
              type={type}
              text={text}
            />
          </Link>
        ))}
      </PillButtonsContainer>
    </Container>
  )
}

export default HamburgerMenu
