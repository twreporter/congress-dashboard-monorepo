'use client'
import React, { useCallback, useEffect, useRef, type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'
import {
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// swiper
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
// components
import { FollowingPeopleCard } from '@/components/following/following-people-card'
// mock data
import { MOCK_PEOPLE_LIST } from '@/components/following/mock-data'

// keep in sync with the padding / width of `Content` in `@/components/home`
const CONTENT_MAX_WIDTH = 928
const MOBILE_PADDING = 24
const TABLET_PADDING = 32
const SLIDE_GAP = 24
// continuous scroll: move (cardWidth + gap) px every 8 seconds
const SLIDE_DURATION = 8000
// resume autoplay after 5 seconds without any interaction
const AUTOPLAY_RESUME_DELAY = 5000
// duration of snapping to the closest card after dragging
const SNAP_DURATION = 300

// methods that exist on the swiper instance but are missing in its typings
type SwiperInternals = {
  setTransition: (duration: number) => void
  updateActiveIndex: (newActiveIndex?: number) => void
}

// how much of the current card is left before reaching the next snap point,
// used to keep a constant scrolling velocity after resuming from a pause
const getRemainingRatio = (swiper: SwiperClass): number => {
  const slideSpan = (swiper.slidesSizesGrid?.[0] ?? 0) + SLIDE_GAP
  if (slideSpan <= 0) {
    return 1
  }
  const travelled = Math.abs(swiper.translate) % slideSpan
  return travelled === 0 ? 1 : 1 - travelled / slideSpan
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleAndDescription = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray800};
`

const Description = styled(P1)`
  color: ${colorGrayscale.gray700};
`

const ListContainer = styled.div`
  width: 100vw;
  margin-left: calc(50% - 50vw);

  /* align the first slide with the padding of the outer content container */
  .swiper {
    padding-left: ${MOBILE_PADDING}px;
    padding-right: ${MOBILE_PADDING}px;
  }
  /* keep the scrolling smooth & linear for the marquee effect */
  .swiper-wrapper {
    transition-timing-function: linear;
  }
  .swiper-slide {
    width: 400px;
    height: auto;
  }
  ${mq.tabletOnly`
    .swiper {
      padding-left: ${TABLET_PADDING}px;
      padding-right: ${TABLET_PADDING}px;
    }
  `}
  ${mq.tabletAndBelow`
    .swiper-slide {
      width: 360px;
    }
  `}
  ${mq.desktopAndAbove`
    .swiper {
      padding-left: calc((100vw - ${CONTENT_MAX_WIDTH}px) / 2);
      padding-right: calc((100vw - ${CONTENT_MAX_WIDTH}px) / 2);
    }
  `}
`

const Activities: FC = () => {
  const swiperRef = useRef<SwiperClass | null>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const pauseAutoplay = useCallback(() => {
    clearResumeTimer()
    const swiper = swiperRef.current
    if (!swiper || swiper.destroyed) {
      return
    }
    swiper.autoplay?.stop()
    // freeze right where it is instead of finishing the running transition
    const currentTranslate = swiper.getTranslate()
    const { setTransition, updateActiveIndex } =
      swiper as unknown as SwiperInternals
    setTransition.call(swiper, 0)
    swiper.setTranslate(currentTranslate)
    updateActiveIndex.call(swiper)
    swiper.updateSlidesClasses()
    // the cancelled transition never fires `transitionend`, so clear the flag
    // ourselves, otherwise `loopPreventsSliding` blocks every later slide
    swiper.animating = false
    // while interacting, releasing a drag should snap to the closest card
    swiper.params.speed = SNAP_DURATION
  }, [clearResumeTimer])

  const resumeAutoplayLater = useCallback(() => {
    clearResumeTimer()
    resumeTimerRef.current = setTimeout(() => {
      const swiper = swiperRef.current
      if (!swiper || swiper.destroyed || swiper.autoplay?.running) {
        return
      }
      // the first slide after resuming only has part of the distance left,
      // shorten its duration so the scrolling speed stays the same
      swiper.params.speed = Math.max(
        1,
        SLIDE_DURATION * getRemainingRatio(swiper)
      )
      swiper.once('slideChangeTransitionStart', () => {
        swiper.params.speed = SLIDE_DURATION
      })
      swiper.autoplay?.start()
    }, AUTOPLAY_RESUME_DELAY)
  }, [clearResumeTimer])

  useEffect(() => clearResumeTimer, [clearResumeTimer])

  return (
    <Container>
      <TitleAndDescription>
        <Title text="立委／議員問政動態" />
        <Description text="查看特定立委／議員的背景與問政表現，觀察他關注的議題有哪些" />
      </TitleAndDescription>
      <ListContainer
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplayLater}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={SLIDE_GAP}
          slidesPerView={'auto'}
          loop={true}
          speed={SLIDE_DURATION}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onTouchStart={pauseAutoplay}
          onTouchEnd={resumeAutoplayLater}
        >
          {MOCK_PEOPLE_LIST.map((person) => {
            const type =
              person.type === 'councilor'
                ? FollowingPeopleCard.Type.COUNCILOR
                : FollowingPeopleCard.Type.LEGISLATOR
            return (
              <SwiperSlide key={person.name}>
                <TabletAndBelow>
                  <FollowingPeopleCard
                    {...person}
                    type={type}
                    size={FollowingPeopleCard.Size.S}
                  />
                </TabletAndBelow>
                <DesktopAndAbove>
                  <FollowingPeopleCard
                    {...person}
                    type={type}
                    size={FollowingPeopleCard.Size.L}
                  />
                </DesktopAndAbove>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </ListContainer>
    </Container>
  )
}

export default Activities
