'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'
// enum
import { TagSize } from '@/components/dashboard/enum'
// type
import type { Tag } from '@/components/dashboard/type'
// components
import Tooltip from '@/components/dashboard/card/tooltip'
import { Triangle, Gap } from '@/components/skeleton'
import PartyTag from '@/components/dashboard/card/party-tag'
// style
import { textOverflowEllipsisCss } from '@/styles/cheetsheet'
// @twreporter
import {
  MEMBER_TYPE_LABEL,
  MemberType,
  Constituency,
  CONSTITUENCY_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import {
  MemberType as CouncilMemberType,
  MEMBER_TYPE as COUNCIL_MEMBER_TYPE,
  MEMBER_TYPE_LABEL as COUNCIL_MEMBER_TYPE_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-member'
import {
  colorGrayscale,
  colorOpacity,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { More } from '@twreporter/react-components/lib/icon'
// lodash
import { throttle } from 'lodash'
const _ = {
  throttle,
}

// global env
const releaseBranch = process.env.RELEASE_BRANCH

export enum CardSize {
  S,
  L,
}

const boxCss = css<{ $size: CardSize }>`
  width: 100%;
  height: ${(props) => (props.$size === CardSize.S ? 154 : 196)}px;
  display: flex;
  border-radius: 4px;
  background-color: ${colorGrayscale.white};
`
const Box = styled.div<{ $selected: boolean; $size: CardSize }>`
  ${boxCss}
  border: 1px solid ${colorOpacity['black_0.1']};
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
const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const Name = styled(H4)`
  ${textOverflowEllipsisCss}
  color: ${colorGrayscale.gray800};
`
const Type = styled(P2)`
  color: ${colorGrayscale.gray800};
`
const DetailContainer = styled.div<{ $isShowTag: boolean; $withGap: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.$isShowTag ? 'flex-start' : 'space-between'};
  padding: 16px;
  min-width: 0;
  ${(props) => (props.$withGap ? 'gap: 14px;' : '')}
`
const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-y: hidden;
  flex-wrap: wrap;
`
const TagItem = styled.div`
  width: fit-content;
  height: 25px;
  padding: 2px 8px;
  text-align: center;
  border-radius: 40px;
  background: ${colorOpacity['black_0.05']};
  color: ${colorGrayscale.gray800};
  font-size: 14px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`
const TagName = styled.span`
  ${textOverflowEllipsisCss}
  flex-shrink: 1;
`
const TagCount = styled.span`
  flex-shrink: 0;
`
const Note = styled(P3)`
  color: ${colorGrayscale.gray600};
`
const AvatarContainer = styled.div`
  position: relative;
`
const avatarCss = css<{ $size: CardSize }>`
  width: ${(props) => (props.$size === CardSize.S ? 119 : 152)}px;
  height: 100%;
`
const Avatar = styled.img<{ $size: CardSize }>`
  ${avatarCss}
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: 1px solid ${colorOpacity['black_0.05']};
`
const Mask = styled.div<{ $size: CardSize }>`
  opacity: 0.1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: ${(props) => (props.$size === CardSize.L ? 64 : 48)}px;
`
const Party = styled(PartyTag)`
  width: 32px;
  height: 32px;
  position: absolute;
  left: 8px;
  bottom: 8px;
`

export type CardHumanType = 'legislator' | 'councilor'
export type CardHumanProps = {
  cardType?: CardHumanType
  name?: string
  tooltip?: string
  note?: string
  type?: MemberType | CouncilMemberType
  constituency?: Constituency | number
  tags?: Tag[]
  avatar?: string
  partyAvatar?: string
  size?: CardSize
  selected?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}
const CardHuman: React.FC<CardHumanProps> = ({
  cardType = 'legislator',
  name = '',
  tooltip = '',
  note = '',
  type = MemberType.Constituency,
  constituency,
  tags = [],
  avatar = '',
  partyAvatar = '',
  size = CardSize.L,
  selected = false,
  onClick,
}: CardHumanProps) => {
  const isShowTag = tags.length > 0

  // calculate how many tags to show
  const [visibleTagCount, setVisibleTagCount] = useState(tags.length)
  const tagBoxRef = useRef<HTMLInputElement>(null)
  const tagRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const tagBoxWidth = useRef(0)
  useEffect(() => {
    const tagBox = tagBoxRef.current
    if (tagBox) {
      const calculateVisibleTags = _.throttle(() => {
        if (!tagBox) return
        if (tagBoxWidth.current === tagBox.clientWidth) {
          return
        }
        tagBoxWidth.current = tagBox.clientWidth

        // tags can show at least two lines
        const availableLines = size === CardSize.L ? 3 : 2
        const oneLineWidth = tagBox.clientWidth
        const moreWidth = 40
        // Calculate how many tags can fit
        let usedLines = 0
        let currentLineUsedWidth = 0
        let count = 0
        // Add width of each tag
        for (let i = 0; i < tags.length; i++) {
          if (usedLines === availableLines) {
            break
          }

          const tag = tags[i]
          const tagElement = tagRefs.current.get(tag.name)
          let tagWidth = 0
          if (tagElement) {
            tagWidth = tagElement.offsetWidth + 8 // 8px for margin
          } else {
            tagWidth = 108 // Default estimated width if tag not yet rendered
          }

          const isLastLine = usedLines === availableLines - 1
          const shouldCalculateMoreWidth = isLastLine && i < tags.length - 1
          const toOccupyWidth = shouldCalculateMoreWidth
            ? tagWidth + moreWidth
            : tagWidth

          // can fit current line
          if (toOccupyWidth + currentLineUsedWidth < oneLineWidth) {
            currentLineUsedWidth += toOccupyWidth
            count++
          } else {
            // try to put it in next line
            if (isLastLine) {
              break
            }
            usedLines++
            currentLineUsedWidth = toOccupyWidth
            count++
          }
        }
        setVisibleTagCount(Math.max(1, count))
      }, 100)
      const resizeObserver = new ResizeObserver(calculateVisibleTags)
      resizeObserver.observe(tagBox)
      calculateVisibleTags()
      return () => {
        resizeObserver.unobserve(tagBox)
        resizeObserver.disconnect()
      }
    }
  }, [tags])

  // Save tag refs for measurement
  const setTagRef = useCallback(
    (element: HTMLDivElement | null, value: string) => {
      if (element) {
        tagRefs.current.set(value, element)
      } else {
        tagRefs.current.delete(value)
      }
    },
    []
  )
  const visibleTags = tags.slice(0, visibleTagCount)
  const hasMoreTag = tags.length > visibleTagCount

  return (
    <Box $selected={selected} $size={size} onClick={onClick}>
      <AvatarContainer>
        <Avatar src={avatar} $size={size} />
        <Mask $size={size} />
        <Party avatar={partyAvatar} size={TagSize.L} />
      </AvatarContainer>
      <DetailContainer $isShowTag={isShowTag} $withGap={true}>
        <div>
          <Title>
            <Name text={name} />
            {tooltip ? <Tooltip tooltip={tooltip} /> : null}
          </Title>
          <Type
            text={
              cardType === 'councilor'
                ? type === COUNCIL_MEMBER_TYPE.constituency
                  ? `第${constituency}選區`
                  : COUNCIL_MEMBER_TYPE_LABEL[type as CouncilMemberType]
                : type === MemberType.Constituency && constituency
                ? CONSTITUENCY_LABEL[constituency as Constituency]
                : MEMBER_TYPE_LABEL[type as MemberType]
            }
          />
        </div>
        {isShowTag ? (
          <TagContainer ref={tagBoxRef}>
            {visibleTags.map(({ name, count }: Tag, index: number) => {
              return (
                <TagItem
                  key={`legislator-${name}-tag-${index}`}
                  ref={(el) => setTagRef(el, name)}
                >
                  <TagName>{name}</TagName>
                  <TagCount
                    key={`legislator-${name}-tag-count-${index}`}
                  >{`(${count})`}</TagCount>
                </TagItem>
              )
            })}
            {hasMoreTag ? (
              <TagItem>
                <More releaseBranch={releaseBranch} />
              </TagItem>
            ) : null}
          </TagContainer>
        ) : (
          <Note text={note} />
        )}
      </DetailContainer>
    </Box>
  )
}
export default CardHuman

const RwdBox = styled.div``
export const CardHumanRWD: React.FC<CardHumanProps> = (props) => (
  <RwdBox>
    <DesktopAndAbove>
      <CardHuman {...props} size={CardSize.L} />
    </DesktopAndAbove>
    <TabletAndBelow>
      <CardHuman {...props} size={CardSize.S} />
    </TabletAndBelow>
  </RwdBox>
)

// skeleton
const BoxSkeleton = styled.div<{ $size: CardSize }>`
  ${boxCss}
`
const AvatarSkeleton = styled(Triangle)<{ $size: CardSize }>`
  ${avatarCss}
`

type CardHumanSkeletonProps = {
  size?: CardSize
}
export const CardHumanSkeleton: React.FC<CardHumanSkeletonProps> = ({
  size = CardSize.L,
}) => {
  const isShowTag = false

  return (
    <BoxSkeleton $size={size}>
      <AvatarContainer>
        <AvatarSkeleton $size={size} />
      </AvatarContainer>
      <DetailContainer $isShowTag={isShowTag} $withGap={false}>
        {size === CardSize.L ? (
          <>
            <Triangle $width={'72px'} $height={'33px'} />
            <Gap $gap={4} />
            <Triangle $width={'136px'} $height={'21px'} />
            <Gap $gap={14} />
            <Triangle $width={'268px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'268px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'96px'} $height={'25px'} />
          </>
        ) : (
          <>
            <Triangle $width={'72px'} $height={'27px'} />
            <Gap $gap={4} />
            <Triangle $width={'120px'} $height={'21px'} />
            <Gap $gap={12} />
            <Triangle $width={'176px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'96px'} $height={'25px'} />
          </>
        )}
      </DetailContainer>
    </BoxSkeleton>
  )
}

export const CardHumanSkeletonRWD: React.FC = () => (
  <RwdBox>
    <DesktopAndAbove>
      <CardHumanSkeleton size={CardSize.L} />
    </DesktopAndAbove>
    <TabletAndBelow>
      <CardHumanSkeleton size={CardSize.S} />
    </TabletAndBelow>
  </RwdBox>
)
