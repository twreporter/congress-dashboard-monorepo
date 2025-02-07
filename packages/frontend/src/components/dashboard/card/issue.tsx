import React from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'
import {
  DesktopAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'

export type Legislator = {
  name: string
  count?: number
  avatar: string
  partyAvatar: string
}
export enum CardSize {
  S,
  M,
  L,
}

const Box = styled.div<{ $selected: boolean; $size: CardSize }>`
  width: calc(100% - 48px);
  display: flex;
  flex-direction: ${(props) => (props.$size === CardSize.S ? 'column' : 'row')};
  justify-content: ${(props) =>
    props.$size === CardSize.S ? 'center' : 'space-between'};
  align-items: ${(props) =>
    props.$size === CardSize.S ? 'flex-start' : 'center'};
  gap: ${(props) => (props.$size === CardSize.S ? 20 : 48)}px;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background-color: ${colorGrayscale.white};
  padding: 24px;
  cursor: pointer;

  ${(props) =>
    props.$selected
      ? `
    border: 1px solid ${colorBrand.dark};
    box-shadow: 0px 0px 16px 0px ${colorOpacity['black_0.2']};
  `
      : `
    &: hover {
      border: 1px solid ${colorOpacity['black_0.2']};
      box-shadow: 0px 0px 16px 0px ${colorOpacity['black_0.1']};
    }
  `}
`
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 24px;
`
const Title = styled(H4)`
  color: ${colorGrayscale.gray800};
`
const SubTitle = styled(P2)`
  color: ${colorGrayscale.gray800};
`
const LegislatorContainer = styled.div<{ $size: CardSize }>`
  display: flex;
  gap: ${(props) => (props.$size === CardSize.S ? 16 : 24)}px;
`
const LegislatorItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const AvatarContainer = styled.div`
  position: relative;
`
const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
`
const Party = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 40px; // 56px - 16px
`
const Text = styled(P3)`
  color: ${colorGrayscale.gray800};
`

export type CardIssueProps = {
  title?: string
  subTitle?: string
  legislators?: Legislator[]
  size?: CardSize
  selected?: boolean
  onClick?: () => void
}
const CardIssue: React.FC<CardIssueProps> = ({
  title = '',
  subTitle = '',
  legislators = [],
  size = CardSize.L,
  selected = false,
  onClick,
}: CardIssueProps) => {
  const activeCount = size === CardSize.L ? 5 : 4
  const activeLegistor = legislators.slice(0, activeCount)

  return (
    <Box $selected={selected} $size={size} onClick={onClick}>
      <TitleContainer>
        <Title text={title} />
        <SubTitle text={subTitle} />
      </TitleContainer>
      <LegislatorContainer $size={size}>
        {activeLegistor.map(
          ({ name, count, avatar, partyAvatar }: Legislator, index: number) => {
            return (
              <LegislatorItem key={`legislator-${index}`}>
                <AvatarContainer>
                  <Avatar src={avatar} />
                  <Party src={partyAvatar} />
                </AvatarContainer>
                <Text text={name} />
                <Text text={`(${count})`} />
              </LegislatorItem>
            )
          }
        )}
      </LegislatorContainer>
    </Box>
  )
}
export default CardIssue

const RwdBox = styled.div`
  width: 100%;
`
const TabletOnly = styled.div`
  display: none;
  ${mq.tabletOnly`
    display: block;
  `}
`
export const CardIssueRWD: React.FC<CardIssueProps> = (props) => (
  <RwdBox>
    <DesktopAndAbove>
      <CardIssue {...props} size={CardSize.L} />
    </DesktopAndAbove>
    <TabletOnly>
      <CardIssue {...props} size={CardSize.M} />
    </TabletOnly>
    <MobileOnly>
      <CardIssue {...props} size={CardSize.S} />
    </MobileOnly>
  </RwdBox>
)
