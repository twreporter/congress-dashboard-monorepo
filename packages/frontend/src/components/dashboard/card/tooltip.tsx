'use client'

import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
// hook
import useOutsideClick from '@/hooks/use-outside-click'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'
// lodash
import throttle from 'lodash/throttle'
const _ = {
  throttle,
}

// info icon
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="currentColor"
  >
    <path
      d="M11 17.5H13V11.5H11V17.5ZM12 9.5C12.2833 9.5 12.5208 9.40417 12.7125 9.2125C12.9042 9.02083 13 8.78333 13 8.5C13 8.21667 12.9042 7.97917 12.7125 7.7875C12.5208 7.59583 12.2833 7.5 12 7.5C11.7167 7.5 11.4792 7.59583 11.2875 7.7875C11.0958 7.97917 11 8.21667 11 8.5C11 8.78333 11.0958 9.02083 11.2875 9.2125C11.4792 9.40417 11.7167 9.5 12 9.5ZM12 22.5C10.6167 22.5 9.31667 22.2375 8.1 21.7125C6.88333 21.1875 5.825 20.475 4.925 19.575C4.025 18.675 3.3125 17.6167 2.7875 16.4C2.2625 15.1833 2 13.8833 2 12.5C2 11.1167 2.2625 9.81667 2.7875 8.6C3.3125 7.38333 4.025 6.325 4.925 5.425C5.825 4.525 6.88333 3.8125 8.1 3.2875C9.31667 2.7625 10.6167 2.5 12 2.5C13.3833 2.5 14.6833 2.7625 15.9 3.2875C17.1167 3.8125 18.175 4.525 19.075 5.425C19.975 6.325 20.6875 7.38333 21.2125 8.6C21.7375 9.81667 22 11.1167 22 12.5C22 13.8833 21.7375 15.1833 21.2125 16.4C20.6875 17.6167 19.975 18.675 19.075 19.575C18.175 20.475 17.1167 21.1875 15.9 21.7125C14.6833 22.2375 13.3833 22.5 12 22.5ZM12 20.5C14.2333 20.5 16.125 19.725 17.675 18.175C19.225 16.625 20 14.7333 20 12.5C20 10.2667 19.225 8.375 17.675 6.825C16.125 5.275 14.2333 4.5 12 4.5C9.76667 4.5 7.875 5.275 6.325 6.825C4.775 8.375 4 10.2667 4 12.5C4 14.7333 4.775 16.625 6.325 18.175C7.875 19.725 9.76667 20.5 12 20.5Z"
      fill="currentColor"
    />
  </svg>
)

// content
const ContentBox = styled.div`
  background-color: ${colorGrayscale.gray800};
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
  padding: 8px 16px;
  max-width: 256px;
  border-radius: 4px;
`
const Text = styled(P2)`
  color: ${colorGrayscale.white};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: -4px;
    top: -12px;
    width: 8px;
    height: 4px;
    background-color: ${colorGrayscale.gray800};
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
`

type ContentProps = {
  text: string
}
const Content: React.FC<ContentProps> = ({ text }: ContentProps) => {
  return (
    <ContentBox>
      <Text text={text} />
    </ContentBox>
  )
}

// tooltip
const Detail = styled.div<{
  $show: boolean
  $position: { top: boolean; left: boolean }
}>`
  position: absolute;
  ${(props) =>
    props.$position.top ? 'bottom: 28px;' : 'top: 28px;'} // icon height(24) + 4
  ${(props) => (props.$position.left ? 'right: -4px;' : 'left: -4px;')}
  width: max-content;
  ${(props) => (props.$show ? '' : 'display: none;')}

  /* Flip the arrow position based on where the tooltip is displayed */
  ${(props) =>
    props.$position.top &&
    !props.$position.left &&
    `
    ${Text}:before {
      top: auto;
      bottom: -12px;
      transform: rotate(180deg);
    }
  `}
  
  ${(props) =>
    !props.$position.top &&
    props.$position.left &&
    `
    ${Text}:before {
      left: auto;
      right: -4px;
    }
  `}
  
  ${(props) =>
    props.$position.top &&
    props.$position.left &&
    `
    ${Text}:before {
      top: auto;
      bottom: -12px;
      left: auto;
      right: -4px;
      transform: rotate(180deg);
    }
  `}
`

const Box = styled.div<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${(props) =>
    props.$show ? colorGrayscale.gray800 : colorGrayscale.gray600};

  ${mq.desktopAndAbove`
    &:hover {
      color: ${colorGrayscale.gray800};
      ${Detail} {
        display: unset;
      }
    }
  `}
`

type TooltipProps = {
  tooltip: string
}
const Tooltip: React.FC<TooltipProps> = ({ tooltip }: TooltipProps) => {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: false, left: false })
  const boxRef = React.useRef<HTMLDivElement>(null)
  const detailRef = React.useRef<HTMLDivElement>(null)

  const checkPosition = _.throttle(() => {
    if (!boxRef.current || !detailRef.current) return

    const boxRect = boxRef.current.getBoundingClientRect()
    const detailRect = detailRef.current.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Check if tooltip would overflow to the right
    const overflowRight = boxRect.left + detailRect.width > windowWidth

    // Check if tooltip would overflow to the bottom
    const overflowBottom = boxRect.bottom + detailRect.height > windowHeight

    setPosition({
      left: overflowRight,
      top: overflowBottom,
    })
  }, 500)

  const toggleTooltip = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShow(!show)

    // Check position on next render when showing tooltip
    if (!show) {
      setTimeout(checkPosition, 0)
    }
  }

  useEffect(() => {
    if (show) {
      checkPosition()

      // Recalculate on window resize
      window.addEventListener('resize', checkPosition)
      return () => window.removeEventListener('resize', checkPosition)
    }
  }, [show])

  // Create a custom handler for outside clicks
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    // Consider clicking on the detail part as "inside"
    if (detailRef.current && detailRef.current.contains(event.target as Node)) {
      return
    }
    setShow(false)
  }, [])

  // Use the useOutsideClick hook with our custom handler
  const outsideClickRef = useOutsideClick(handleOutsideClick)

  // Set up the combined ref handling
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      boxRef.current = element

      // The useOutsideClick hook returns a ref object; we need to assign it to our element
      if (
        outsideClickRef &&
        typeof outsideClickRef === 'object' &&
        'current' in outsideClickRef
      ) {
        outsideClickRef.current = element
      }
    },
    [outsideClickRef]
  )

  return (
    <Box onClick={toggleTooltip} $show={show} ref={setRefs}>
      <InfoIcon />
      <Detail
        $show={show}
        $position={position}
        ref={detailRef}
        onClick={(e) => e.stopPropagation()} // Prevent tooltip from closing when clicking detail
      >
        <Content text={tooltip} />
      </Detail>
    </Box>
  )
}
export default Tooltip
