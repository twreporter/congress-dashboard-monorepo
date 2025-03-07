'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'
// components
import Tooltip from '@/components/dashboard/card/tooltip'
import { Triangle, Gap } from '@/components/dashboard/card/skeleton'
import PartyTag, { TagSize } from '@/components/dashboard/card/party-tag'
// @twreporter
import {
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
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
// lodash
import { throttle } from 'lodash'
const _ = {
  throttle,
}

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
const textOverflowEllipsisCss = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
const TagContainer = styled.div<{ $size: CardSize }>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => (props.$size === CardSize.S ? 8 : 12)}px;
  overflow-y: hidden;
  flex-wrap: wrap;
`
const TagItem = styled.div`
  width: fit-content;
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

export type Tag = {
  name: string
  count: number
}

export type CardHumanProps = {
  name?: string
  tooltip?: string
  note?: string
  type?: MemberType
  tags?: Tag[]
  avatar?: string
  partyAvatar?: string
  size?: CardSize
  selected?: boolean
  onClick?: () => void
}
const CardHuman: React.FC<CardHumanProps> = ({
  name = '',
  tooltip = '',
  note = '',
  type = MemberType.Constituency,
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
  useEffect(() => {
    const tagBox = tagBoxRef.current
    if (tagBox) {
      const calculateVisibleTags = _.throttle(() => {
        if (!tagBox) return
        // tags can show at least two lines
        const availableWidth = tagBox.clientWidth * 2
        // Calculate how many tags can fit
        let totalWidth = 0
        let count = 0
        // Add width of each tag
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i]
          const tagElement = tagRefs.current.get(tag.name)
          let tagWidth = 0
          if (tagElement) {
            tagWidth = tagElement.offsetWidth + 8 // 8px for margin
          } else {
            tagWidth = 108 // Default estimated width if tag not yet rendered
          }
          // "+N..." tag width approx 30px
          if (totalWidth + tagWidth < availableWidth - 30) {
            totalWidth += tagWidth
            count++
          } else {
            break
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
          <Type text={MEMBER_TYPE_LABEL[type]} />
        </div>
        {isShowTag ? (
          <TagContainer $size={size} ref={tagBoxRef}>
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
                <TagName>...</TagName>
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
