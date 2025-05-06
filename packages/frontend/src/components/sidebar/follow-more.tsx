import React from 'react'
import styled from 'styled-components'
// constant
import { InternalRoutes } from '@/constants/navigation-link'
// component
import PartyTag from '@/components/dashboard/card/party-tag'
import { CircleRaw } from '@/components/skeleton'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'

// legislative component
const LegislatorItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 56px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`
const AvatarContainer = styled.div`
  position: relative;
`
const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
`
const Party = styled(PartyTag)`
  &,
  & > svg,
  & > img {
    width: 16px !important;
    height: 16px !important;
  }
  position: absolute;
  right: 0;
  top: 40px; // 56px - 16px
`
const Text = styled(P3)`
  color: ${colorGrayscale.gray800};
`

export type LegislatorProps = {
  name?: string
  avatar?: string
  partyAvatar?: string
  count?: number
  slug: string
}
export const Legislator: React.FC<LegislatorProps> = ({
  name = '',
  avatar,
  partyAvatar,
  count,
  slug,
}: LegislatorProps) => {
  const gotoLegislator = () => {
    window.open(`${InternalRoutes.Legislator}/${slug}`, '_self')
  }

  return (
    <LegislatorItem onClick={gotoLegislator}>
      <AvatarContainer>
        {avatar ? (
          <Avatar src={avatar} />
        ) : (
          <CircleRaw width={56} height={56} />
        )}
        {partyAvatar ? <Party avatar={partyAvatar} /> : null}
      </AvatarContainer>
      <Text text={name} />
      <Text text={`(${count})`} />
    </LegislatorItem>
  )
}

// issue component
const TagName = styled(P2)`
  color: ${colorGrayscale.gray600};
`
const TagItem = styled.div`
  width: fit-content;
  padding: 5px 10px;
  text-align: center;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  border: 1px solid ${colorGrayscale.gray600};
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    border: 1px solid ${colorGrayscale.gray800};

    ${TagName} {
      color: ${colorGrayscale.gray800};
    }
  }
`

export type IssueProps = {
  name?: string
  count?: number
  slug: string
}
export const Issue: React.FC<IssueProps> = ({
  name = '',
  count,
  slug,
}: IssueProps) => {
  const gotoIssue = () => {
    window.open(`${InternalRoutes.Topic}/${slug}`, '_self')
  }

  return (
    <TagItem onClick={gotoIssue}>
      <TagName>{count ? `${name}(${count})` : name}</TagName>
    </TagItem>
  )
}
