'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
// enum
import { TagSize } from '@/components/dashboard/enum'
// type
import type { Tag } from '@/components/dashboard/type'
import { ValuesOf } from '@/types'
// components
import Tooltip from '@/components/dashboard/card/tooltip'
import { Triangle, Gap } from '@/components/skeleton'
import PartyTag from '@/components/dashboard/card/party-tag'
// hook
import useOutsideClick from '@/hooks/use-outside-click'
// style
import { textOverflowEllipsisCss } from '@/styles/cheetsheet'
import { ZIndex } from '@/styles/z-index'
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
const Avatar = styled.img<{ $size: CardSize; $cardType?: CardHumanType }>`
  ${avatarCss}
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: 1px solid ${colorOpacity['black_0.05']};
  ${(props) =>
    props.$cardType === 'councilor'
      ? `
    object-fit: cover;
  `
      : `
    ''
  `}
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

// More tag popover styles
const MoreTagWrapper = styled.div`
  display: inline-flex;
`

const MoreTagPopover = styled.div<{
  $show: boolean
  $top: number
  $left: number
  $position: { top: boolean; left: boolean }
}>`
  z-index: ${ZIndex.Tooltip};
  position: fixed;
  ${(props) =>
    props.$position.top
      ? `bottom: calc(100vh - ${props.$top}px); margin-bottom: 8px;`
      : `top: ${props.$top}px; margin-top: 8px;`}
  ${(props) =>
    props.$position.left
      ? `right: calc(100vw - ${props.$left}px);`
      : `left: ${props.$left}px;`}
  background-color: ${colorGrayscale.gray800};
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
  padding: 8px 16px;
  border-radius: 4px;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  color: ${colorGrayscale.white};
  font-size: 14px;
  line-height: 150%;
  pointer-events: none;
  max-width: 256px;
  word-break: break-all;

  &:before {
    content: '';
    position: absolute;
    ${(props) => (props.$position.left ? 'right: 12px;' : 'left: 12px;')}
    ${(props) =>
      props.$position.top
        ? `
      bottom: -4px;
      clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
    `
        : `
      top: -4px;
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    `}
    width: 8px;
    height: 4px;
    background-color: ${colorGrayscale.gray800};
  }
`
export const CARD_HUMAN_TYPE = {
  Legislator: 'legislator',
  Councilor: 'councilor',
} as const
export type CardHumanType = ValuesOf<typeof CARD_HUMAN_TYPE>
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
  cardType = CARD_HUMAN_TYPE.Legislator,
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
  const hiddenTags = tags.slice(visibleTagCount)
  const hasMoreTag = tags.length > visibleTagCount

  // More tag hover state
  const [showMorePopover, setShowMorePopover] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const [popoverPlacement, setPopoverPlacement] = useState({
    top: false,
    left: false,
  })
  const moreTagRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const checkPopoverPosition = useCallback(() => {
    if (!moreTagRef.current) return

    const rect = moreTagRef.current.getBoundingClientRect()
    const popoverWidth = popoverRef.current?.offsetWidth || 256 // use actual width or max-width estimate
    const popoverHeight = popoverRef.current?.offsetHeight || 100 // estimate if not rendered
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Check if popover would overflow to the right
    const overflowRight = rect.left + popoverWidth > windowWidth

    // Check if popover would overflow to the bottom
    const overflowBottom = rect.bottom + popoverHeight + 8 > windowHeight

    setPopoverPlacement({
      left: overflowRight,
      top: overflowBottom,
    })

    setPopoverPosition({
      top: overflowBottom ? rect.top : rect.bottom,
      left: overflowRight ? rect.right : rect.left,
    })
  }, [])

  const handleMoreMouseEnter = useCallback(() => {
    checkPopoverPosition()
    setShowMorePopover(true)
  }, [checkPopoverPosition])
  const handleMoreMouseLeave = useCallback(() => {
    setShowMorePopover(false)
  }, [])
  const handleMoreClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      checkPopoverPosition()
      setShowMorePopover((prev) => !prev)
    },
    [checkPopoverPosition]
  )

  // Hide popover on scroll
  useEffect(() => {
    if (!showMorePopover) return

    const handleScroll = () => {
      setShowMorePopover(false)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showMorePopover])

  // Hide popover on click outside
  const handleOutsideClick = useCallback(() => {
    setShowMorePopover(false)
  }, [])
  const outsideClickRef = useOutsideClick<HTMLDivElement>(handleOutsideClick)

  // Combine refs for moreTagRef and outsideClickRef
  const setMoreTagRefs = useCallback(
    (element: HTMLDivElement | null) => {
      moreTagRef.current = element
      outsideClickRef(element)
    },
    [outsideClickRef]
  )

  const popoverContent = hiddenTags
    .map(({ name, count }: Tag) => `${name}(${count})`)
    .join('、')

  return (
    <Box $selected={selected} $size={size} onClick={onClick}>
      <AvatarContainer>
        <Avatar src={avatar} $size={size} $cardType={cardType} />
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
              cardType === CARD_HUMAN_TYPE.Councilor
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
              <MoreTagWrapper
                ref={setMoreTagRefs}
                onMouseEnter={handleMoreMouseEnter}
                onMouseLeave={handleMoreMouseLeave}
                onClick={handleMoreClick}
              >
                <TagItem>
                  <More releaseBranch={releaseBranch} />
                </TagItem>
                {typeof document !== 'undefined' &&
                  createPortal(
                    <MoreTagPopover
                      ref={popoverRef}
                      $show={showMorePopover}
                      $top={popoverPosition.top}
                      $left={popoverPosition.left}
                      $position={popoverPlacement}
                    >
                      {popoverContent}
                    </MoreTagPopover>,
                    document.body
                  )}
              </MoreTagWrapper>
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
