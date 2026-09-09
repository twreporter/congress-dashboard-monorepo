import type { ComponentType } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  History,
  KidStar,
  Letter,
  Member,
} from '@twreporter/react-components/lib/icon'

import { MEMBER_ACCOUNT_LINKS } from '@/constants/member-account-link'

const AccountLink = styled(Link)`
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  color: ${colorGrayscale.gray800};
  font-size: 16px;
  text-decoration: none;

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }
`

const ACCOUNT_LINK_ICONS: Record<
  (typeof MEMBER_ACCOUNT_LINKS)[number]['icon'],
  ComponentType<{ releaseBranch?: string }>
> = {
  history: History,
  letter: Letter,
  star: KidStar,
  member: Member,
}

type MemberAccountLinksProps = {
  onNavigate?: () => void
}

function MemberAccountLinks({ onNavigate }: MemberAccountLinksProps) {
  const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

  return MEMBER_ACCOUNT_LINKS.map(({ href, icon, label }) => {
    const Icon = ACCOUNT_LINK_ICONS[icon]
    return (
      <AccountLink key={href} href={href} onClick={onNavigate}>
        <Icon releaseBranch={releaseBranch} />
        {label}
      </AccountLink>
    )
  })
}

export default MemberAccountLinks