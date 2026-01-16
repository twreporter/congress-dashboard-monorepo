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
  width: 100%;
  ${mq.tabletAndBelow`
    .swiper-slide {
      width: 300px;
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
  const [desktopOffset, setDesktopOffset] = useState(256)

  useEffect(() => {
    const calculateOffset = () => {
      if (
        typeof window !== 'undefined' &&
        window.innerWidth >= DESKTOP_BREAKPOINT
      ) {
        const offset = Math.max(0, (window.innerWidth - CONTENT_MAX_WIDTH) / 2)
        setDesktopOffset(offset)
      }
    }

    calculateOffset()
    window.addEventListener('resize', calculateOffset)
    return () => window.removeEventListener('resize', calculateOffset)
  }, [])

  useEffect(() => {
    if (swiper) {
      swiper.params.slidesOffsetBefore = desktopOffset
      swiper.params.slidesOffsetAfter = desktopOffset
      swiper.update()
    }
  }, [desktopOffset, swiper])

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
              slidesOffsetBefore: desktopOffset,
              slidesOffsetAfter: desktopOffset,
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
