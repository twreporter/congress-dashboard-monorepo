'use client'
import React, { useState, createContext, useContext } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { IconWithTextButton } from '@twreporter/react-components/lib/button'
import {
  Text,
  Share,
  Facebook,
  Twitter,
  Line,
  Copy,
  Arrow,
  Video,
  Report,
  Switch,
} from '@twreporter/react-components/lib/icon'
import useOutsideClick from '@twreporter/react-components/lib/hook/use-outside-click'
// components
import TabBarButton from '@/components/button/tab-bar-button'
// toastr
import toastr from '@/utils/toastr'
// constants
import { Direction } from '@/components/speech'

// styles
const MobileToolbarContainer = styled.div<{
  $isHidden: boolean
  $hideText: boolean
}>`
  display: flex;
  width: 100%;
  justify-content: center;
  position: fixed;
  left: 0px;
  bottom: env(safe-area-inset-bottom, 0);
  background-color: ${colorGrayscale.gray100};
  border-top: 1px solid ${colorGrayscale.gray300};
  height: ${(props) => (props.$hideText ? '40px' : '55px')};
  transform: ${(props) =>
    props.$isHidden ? 'translateY(200%)' : 'tanslateY(0%)'};
  transition: height 200ms, transform 200ms ease-in-out;
`

const ToolBar = styled.div`
  display: flex;
  width: 100%;
  padding: 4px 16px;
  gap: 8px;
  max-width: 560px;
  justify-content: space-evenly;
  align-items: center;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  position: relative;
  a {
    text-decoration: none;
  }
`

const ShareOptionsContainer = styled.div<{ $isShow: boolean }>`
  visibility: ${(props) => (props.$isShow ? 'visible' : 'hidden')};
  transition: visibility 100ms;
  position: absolute;
  top: -55px;
  left: 5px;
  display: flex;
  gap: 8px;
  z-index: 6;
`

const SwitchOptionsContainer = styled.div<{ $isShow: boolean }>`
  visibility: ${(props) => (props.$isShow ? 'visible' : 'hidden')};
  transition: visibility 100ms;
  position: absolute;
  top: -55px;
  left: 50%;
  display: flex;
  gap: 8px;
  z-index: 6;
  transform: translateX(-50%);
`

// global variables
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const MobileToolbarContext = createContext<{ hideText: boolean }>({
  hideText: false,
})

const FeedbackButton: React.FC = () => {
  const { hideText } = useContext(MobileToolbarContext)
  return (
    <ButtonContainer>
      <Link href="/feedback">
        <IconWithTextButton
          text="問題回報"
          iconComponent={<Report releaseBranch={releaseBranch} />}
          hideText={hideText}
        />
      </Link>
    </ButtonContainer>
  )
}

const ShareButton: React.FC = () => {
  const [isShow, setIsShow] = useState(false)
  const { hideText } = useContext(MobileToolbarContext)
  const onClick = () => {
    setIsShow(!isShow)
  }
  const ref = useOutsideClick(() => setIsShow(false))

  const handleCopyOnClick = async () => {
    try {
      const currentURL = window.location.href
      await navigator.clipboard.writeText(currentURL)
      toastr({ text: '已複製', timeout: 3000 })
    } catch (_error) {
      toastr({ text: '出了點錯誤', timeout: 3000 })
    }
  }
  const handleFBClick = () => {
    const appID = '962589903815787'
    const currentURL = window.location.href
    const location =
      'https://www.facebook.com/dialog/feed?' +
      'display=page' +
      `&app_id=${appID}` +
      `&link=${encodeURIComponent(currentURL)}` +
      `&redirect_uri=${encodeURIComponent('https://www.facebook.com/')}`

    window.open(location, '_blank')
  }
  const handleLineClick = () => {
    const currentURL = window.location.href
    const location = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      currentURL
    )}`

    window.open(location, '_blank')
  }
  const handleTwitterClick = () => {
    const currentURL = window.location.href
    const location =
      'https://twitter.com/intent/tweet?' +
      `url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(
        document.title + ' #報導者'
      )}`

    window.open(location, '_blank')
  }
  return (
    <ButtonContainer onClick={onClick} ref={ref}>
      <IconWithTextButton
        text="分享"
        iconComponent={<Share releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
      <ShareOptionsContainer $isShow={isShow}>
        <TabBarButton
          icon={<Facebook releaseBranch={releaseBranch} />}
          onClick={handleFBClick}
        />
        <TabBarButton
          icon={<Line releaseBranch={releaseBranch} />}
          onClick={handleLineClick}
        />
        <TabBarButton
          icon={<Twitter releaseBranch={releaseBranch} />}
          onClick={handleTwitterClick}
        />
        <TabBarButton
          icon={<Copy releaseBranch={releaseBranch} />}
          onClick={handleCopyOnClick}
        />
      </ShareOptionsContainer>
    </ButtonContainer>
  )
}

type SwitchButtonProps = {
  isLastSpeech?: boolean
  isFirstSpeech?: boolean
  onSwitchClick: (direction: Direction) => void
}
const SwitchButton: React.FC<SwitchButtonProps> = ({
  isLastSpeech = false,
  isFirstSpeech = false,
  onSwitchClick,
}) => {
  const [isShow, setIsShow] = useState(false)
  const { hideText } = useContext(MobileToolbarContext)
  const onClick = () => {
    setIsShow(!isShow)
  }
  const ref = useOutsideClick(() => setIsShow(false))

  const handlePrevClick = () => {
    onSwitchClick(Direction.PREV)
  }

  const handleNextClick = () => {
    onSwitchClick(Direction.NEXT)
  }

  return (
    <ButtonContainer onClick={onClick} ref={ref}>
      <IconWithTextButton
        text="切換片段"
        iconComponent={<Switch releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
      <SwitchOptionsContainer $isShow={isShow}>
        <TabBarButton
          disabled={isFirstSpeech}
          icon={
            <Arrow
              releaseBranch={releaseBranch}
              direction={Arrow.Direction.LEFT}
            />
          }
          onClick={handlePrevClick}
        />
        <TabBarButton
          disabled={isLastSpeech}
          icon={
            <Arrow
              releaseBranch={releaseBranch}
              direction={Arrow.Direction.RIGHT}
            />
          }
          onClick={handleNextClick}
        />
      </SwitchOptionsContainer>
    </ButtonContainer>
  )
}

type FontSizeButtonProps = {
  onClick: () => void
}
const FontSizeButton: React.FC<FontSizeButtonProps> = ({ onClick }) => {
  const { hideText } = useContext(MobileToolbarContext)
  return (
    <ButtonContainer onClick={onClick}>
      <IconWithTextButton
        text="文字大小"
        iconComponent={<Text releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
    </ButtonContainer>
  )
}

type IVODButtonProps = {
  link: string
}
const IVODButton: React.FC<IVODButtonProps> = ({ link }) => {
  const { hideText } = useContext(MobileToolbarContext)
  return (
    <ButtonContainer onClick={() => window.open(link, '_blank')}>
      <IconWithTextButton
        text="看IVOD"
        iconComponent={<Video releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
    </ButtonContainer>
  )
}

type MobileToolbarProps = {
  onFontSizeChange: () => void
  iVODLink: string
  isLastSpeech: boolean
  isFirstSpeech: boolean
  onSwitchClick: (direction: Direction) => void
  scrollStage: number
}
const MobileToolbar: React.FC<MobileToolbarProps> = ({
  onFontSizeChange,
  iVODLink,
  isLastSpeech,
  isFirstSpeech,
  onSwitchClick,
  scrollStage,
}) => {
  const isHidden = scrollStage >= 3
  const hideText = scrollStage >= 2
  const contextValue = { hideText }

  return (
    <MobileToolbarContext.Provider value={contextValue}>
      <MobileToolbarContainer $isHidden={isHidden} $hideText={hideText}>
        <ToolBar>
          <FeedbackButton />
          <ShareButton />
          <SwitchButton
            isLastSpeech={isLastSpeech}
            isFirstSpeech={isFirstSpeech}
            onSwitchClick={onSwitchClick}
          />
          <FontSizeButton onClick={onFontSizeChange} />
          <IVODButton link={iVODLink} />
        </ToolBar>
      </MobileToolbarContainer>
    </MobileToolbarContext.Provider>
  )
}

export default MobileToolbar
