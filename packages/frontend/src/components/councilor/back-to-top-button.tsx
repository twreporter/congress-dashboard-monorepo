'use client'

import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import mq, { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'
import { ZIndex } from '@/styles/z-index'

const Button = styled.button<{ $footerOffset: number }>`
  width: 40px;
  height: 40px;
  position: fixed;
  z-index: ${ZIndex.BackToTopButton};
  right: 80px;
  bottom: max(
    calc(24px + env(safe-area-inset-bottom, 0px)),
    ${(props) => props.$footerOffset}px
  );
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  color: ${colorGrayscale.white};
  background: ${colorGrayscale.gray400};
  box-shadow: 0 0 24px 0 ${colorOpacity['black_0.1']};
  cursor: pointer;

  svg {
    height: 16px;
    width: 16px;
  }

  ${mq.desktopOnly`
    right: 56px;
  `}

  ${mq.tabletOnly`
    right: 32px;
    bottom: max(
      calc(16px + env(safe-area-inset-bottom, 0px)),
      ${(props) => props.$footerOffset}px
    );
  `}

  ${mq.mobileOnly`
    right: 24px;
    bottom: max(
      calc(16px + env(safe-area-inset-bottom, 0px)),
      ${(props) => props.$footerOffset}px
    );
  `}

  &:hover {
    background: ${colorGrayscale.gray500};
  }
`

const ArrowUpward = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6.588 3.4L1.688 8.3C1.488 8.5 1.25467 8.59583 0.988 8.5875C0.721333 8.57917 0.488 8.475 0.288 8.275C0.104667 8.075 0.00883333 7.84167 0.0005 7.575C-0.00783333 7.30833 0.088 7.075 0.288 6.875L6.888 0.275C6.988 0.175 7.09633 0.104167 7.213 0.0625C7.32967 0.0208333 7.45467 0 7.588 0C7.72133 0 7.84633 0.0208333 7.963 0.0625C8.07967 0.104167 8.188 0.175 8.288 0.275L14.888 6.875C15.0713 7.05833 15.163 7.2875 15.163 7.5625C15.163 7.8375 15.0713 8.075 14.888 8.275C14.688 8.475 14.4505 8.575 14.1755 8.575C13.9005 8.575 13.663 8.475 13.463 8.275L8.588 3.4V14.575C8.588 14.8583 8.49217 15.0958 8.3005 15.2875C8.10883 15.4792 7.87133 15.575 7.588 15.575C7.30467 15.575 7.06717 15.4792 6.8755 15.2875C6.68383 15.0958 6.588 14.8583 6.588 14.575V3.4Z"
      fill="currentColor"
    />
  </svg>
)

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [footerOffset, setFooterOffset] = useState(0)

  useEffect(() => {
    let animationFrame: number | null = null
    let footer: HTMLElement | null = null

    const updatePosition = () => {
      animationFrame = null
      setIsVisible(window.scrollY > window.innerHeight * 0.2)

      footer ??= document.querySelector('footer')
      if (!footer) {
        setFooterOffset(0)
        return
      }

      const footerTop = footer.getBoundingClientRect().top
      if (footerTop >= window.innerHeight) {
        setFooterOffset(0)
        return
      }

      const footerGap =
        window.innerWidth >= DEFAULT_SCREEN.hd.minWidth
          ? 120
          : window.innerWidth >= DEFAULT_SCREEN.desktop.minWidth
          ? 40
          : 20
      setFooterOffset(window.innerHeight - footerTop + footerGap)
    }

    const scheduleUpdate = () => {
      if (animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(updatePosition)
    }

    updatePosition()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    []
  )

  if (!isVisible) return null

  return (
    <Button
      type="button"
      aria-label="回到頁面頂端"
      $footerOffset={footerOffset}
      onClick={scrollToTop}
    >
      {ArrowUpward}
    </Button>
  )
}

export default BackToTopButton
