import React from 'react'
import styled, { css } from 'styled-components'
// components
import { Triangle, Circle, Gap } from './skeleton'
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

const boxCss = css<{ $size: CardSize }>`
  width: calc(100% - 48px);
  display: flex;
  flex-direction: ${(props) => (props.$size === CardSize.S ? 'column' : 'row')};
  justify-content: ${(props) =>
    props.$size === CardSize.S ? 'center' : 'space-between'};
  align-items: ${(props) =>
    props.$size === CardSize.S ? 'flex-start' : 'center'};
  border-radius: 4px;
  background-color: ${colorGrayscale.white};
  padding: 24px;
`
const Box = styled.div<{ $selected: boolean; $size: CardSize }>`
  ${boxCss}
  gap: ${(props) => (props.$size === CardSize.S ? 20 : 48)}px;
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
const legislatorItemCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const LegislatorItem = styled.div`
  ${legislatorItemCss}
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

// skeleton
const BoxSkeleton = styled.div<{ $size: CardSize }>`
  ${boxCss}
`
const LegislatorItemSkeleton = styled.div`
  ${legislatorItemCss}
`

type CardIssueSkeletonProps = {
  size?: CardSize
}
export const CardIssueSkeleton: React.FC<CardIssueSkeletonProps> = ({
  size = CardSize.L,
}: CardIssueSkeletonProps) => (
  <BoxSkeleton $size={size}>
    <TitleContainer>
      {size === CardSize.L || size === CardSize.S ? (
        <>
          <Triangle $width={'360px'} $height={'33px'} />
          <Gap $gap={4} />
          <Triangle $width={'160px'} $height={'21px'} />
        </>
      ) : (
        <>
          <Triangle $width={'240px'} $height={'27px'} />
          <Gap $gap={4} />
          <Triangle $width={'120px'} $height={'21px'} />
        </>
      )}
    </TitleContainer>
    {size === CardSize.S ? (
      <>
        <Gap $gap={20} />
      </>
    ) : null}
    <LegislatorContainer $size={size}>
      {[1, 2, 3, 4].map((value: number) => (
        <LegislatorItemSkeleton key={`legislator-skeleton-${value}`}>
          <Circle />
          <Gap $gap={8} />
          <Triangle $width={'44px'} $height={'17px'} />
          <Gap $gap={2} />
          <Triangle $width={'44px'} $height={'17px'} />
        </LegislatorItemSkeleton>
      ))}
    </LegislatorContainer>
  </BoxSkeleton>
)

export const CardIssueSkeletonRWD: React.FC = () => (
  <RwdBox>
    <DesktopAndAbove>
      <CardIssueSkeleton size={CardSize.L} />
    </DesktopAndAbove>
    <TabletOnly>
      <CardIssueSkeleton size={CardSize.M} />
    </TabletOnly>
    <MobileOnly>
      <CardIssueSkeleton size={CardSize.S} />
    </MobileOnly>
  </RwdBox>
)
