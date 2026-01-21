'use client'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'

// components
import Card, { type CardProps } from '@/components/topic-sliders/card'
import IconButton from '@/components/button/icon-button'

const CONTENT_MAX_WIDTH = 928
const DESKTOP_BREAKPOINT = 1024
const HD_BREAKPOINT = 1440

const Container = styled.div`
  width: 100%;
  padding-top: 40px;
  padding-bottom: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  background-color: ${colorGrayscale.gray100};
  ${mq.tabletOnly`
    padding-top: 32px;
    padding-bottom: 56px;
  `};
  ${mq.mobileOnly`
    padding-top: 20px;
    padding-bottom: 40px;
  `}
`

const Controller = styled.div`
  width: 100%;
  max-width: 928px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mq.tabletOnly`
    padding-left: 32px;
    padding-right: 32px;
  `}
  ${mq.mobileOnly`
    padding-left: 24px;
    padding-right: 24px;
  `}
`

const H4Gray800 = styled(H4)`
  color: ${colorGrayscale.gray800};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const SwiperContainer = styled.div`
  position: relative;
  width: 100%;

  ${mq.tabletAndBelow`
    .swiper-slide {
      width: 300px;
    }
  `}

  ${mq.hdOnly`
    width: 1168px; // 928 + 120*2

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      height: 100%;
      z-index: 10;
      pointer-events: none;
      width: 120px;
    }

    &::before {
      left: 0;
      background: linear-gradient(
        to right,
        ${colorGrayscale.gray100} 0%,
        transparent 100%
      );
    }

    &::after {
      right: 0;
      background: linear-gradient(
        to left,
        ${colorGrayscale.gray100} 0%,
        transparent 100%
      );
    }
  `}
`

type SlidersProps = {
  cards?: CardProps[]
}
const Sliders: React.FC<SlidersProps> = ({ cards }) => {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [isSwiperBeginning, setIsSwiperBeginning] = useState(true)
  const [isSwiperEnd, setIsSwiperEnd] = useState(false)

  useEffect(() => {
    const calculateOffset = () => {
      if (typeof window === 'undefined' || !swiper) return

      const width = window.innerWidth
      // only need to dynamically calculate offset at 1024px-1440px
      if (width >= DESKTOP_BREAKPOINT && width < HD_BREAKPOINT) {
        const offset = Math.max(0, (width - CONTENT_MAX_WIDTH) / 2)
        swiper.params.slidesOffsetBefore = offset
        swiper.params.slidesOffsetAfter = offset
      }
      swiper.update()
    }

    calculateOffset()
    window.addEventListener('resize', calculateOffset)
    return () => window.removeEventListener('resize', calculateOffset)
  }, [swiper])

  const onSwiperSlideChange = (swiper: SwiperClass) => {
    if (swiper.isEnd) {
      setIsSwiperEnd(true)
      setIsSwiperBeginning(false)
    } else if (swiper.isBeginning) {
      setIsSwiperEnd(false)
      setIsSwiperBeginning(true)
    } else {
      setIsSwiperEnd(false)
      setIsSwiperBeginning(false)
    }
  }

  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <Container>
      <Controller>
        <H4Gray800 text="精選議題" />
        <ButtonGroup>
          <IconButton
            disabled={isSwiperBeginning}
            direction={IconButton.Direction.LEFT}
            onClick={() => swiper?.slidePrev()}
          />
          <IconButton
            disabled={isSwiperEnd}
            direction={IconButton.Direction.RIGHT}
            onClick={() => swiper?.slideNext()}
          />
        </ButtonGroup>
      </Controller>
      <SwiperContainer>
        <Swiper
          spaceBetween={24}
          slidesPerView={'auto'}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          breakpoints={{
            768: {
              slidesOffsetBefore: 32,
              slidesOffsetAfter: 32,
            },
            1024: {
              slidesOffsetBefore: 48,
              slidesOffsetAfter: 48,
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1440: {
              slidesOffsetBefore: 120,
              slidesOffsetAfter: 120,
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          onSlideChange={onSwiperSlideChange}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <Card {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
    </Container>
  )
}
export default Sliders
