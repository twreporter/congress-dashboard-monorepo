'use client'
import React, { useState, createContext, useContext, useEffect } from 'react'
import styled from 'styled-components'
// hook
import useOutsideClick from '@/hooks/use-outside-click'
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
// components
import TabBarButton from '@/components/button/tab-bar-button'
// toastr
import toastr from '@/utils/toastr'
// constants
import { Direction } from '@/components/speech'
// util
import { openFeedback } from '@/utils/feedback'

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
    props.$isHidden ? 'translateY(200%)' : 'translateY(0%)'};
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
  position: relative;
`

const OptionsContainer = styled.div<{ $isShow: boolean }>`
  visibility: ${(props) => (props.$isShow ? 'visible' : 'hidden')};
  transition: visibility 100ms;
  position: absolute;
  top: -55px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  a {
    text-decoration: none;
  }
`

type ButtonGroupType = 'share' | 'switch' | 'none'
// global variables
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const MobileToolbarContext = createContext<{
  hideText: boolean
  setButtonGroup: React.Dispatch<React.SetStateAction<ButtonGroupType>>
}>({
  hideText: false,
  setButtonGroup: () => {},
})

const FeedbackButton: React.FC = () => {
  const { hideText } = useContext(MobileToolbarContext)
  return (
    <ButtonContainer onClick={openFeedback}>
      <IconWithTextButton
        text="問題回報"
        iconComponent={<Report releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
    </ButtonContainer>
  )
}

const ShareButton: React.FC = () => {
  const { hideText, setButtonGroup } = useContext(MobileToolbarContext)
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setButtonGroup((prev) => (prev === 'share' ? 'none' : 'share'))
  }
  const ref = useOutsideClick(() => setButtonGroup('none'))

  return (
    <ButtonContainer onClick={onClick} ref={ref}>
      <IconWithTextButton
        text="分享"
        iconComponent={<Share releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
    </ButtonContainer>
  )
}

const SwitchButton: React.FC = () => {
  const { hideText, setButtonGroup } = useContext(MobileToolbarContext)
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setButtonGroup((prev) => (prev === 'switch' ? 'none' : 'switch'))
  }
  const ref = useOutsideClick(() => setButtonGroup('none'))

  return (
    <ButtonContainer onClick={onClick} ref={ref}>
      <IconWithTextButton
        text="切換片段"
        iconComponent={<Switch releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
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

type ShareButtonGroupProps = {
  isShow: boolean
}

const ShareButtonGroup: React.FC<ShareButtonGroupProps> = ({ isShow }) => {
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
    <OptionsContainer $isShow={isShow}>
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
    </OptionsContainer>
  )
}

type SwitchButtonGroupProps = {
  isShow: boolean
  onSwitchClick: (direction: Direction) => void
  isFirstSpeech: boolean
  isLastSpeech: boolean
}

const SwitchButtonGroup: React.FC<SwitchButtonGroupProps> = ({
  isShow,
  onSwitchClick,
  isFirstSpeech,
  isLastSpeech,
}) => {
  const handlePrevClick = () => {
    if (!isFirstSpeech) {
      onSwitchClick(Direction.PREV)
    }
  }

  const handleNextClick = () => {
    if (!isLastSpeech) {
      onSwitchClick(Direction.NEXT)
    }
  }

  return (
    <OptionsContainer $isShow={isShow}>
      <TabBarButton
        icon={
          <Arrow
            releaseBranch={releaseBranch}
            direction={Arrow.Direction.LEFT}
          />
        }
        onClick={handlePrevClick}
        disabled={isFirstSpeech}
      />
      <TabBarButton
        icon={
          <Arrow
            releaseBranch={releaseBranch}
            direction={Arrow.Direction.RIGHT}
          />
        }
        onClick={handleNextClick}
        disabled={isLastSpeech}
      />
    </OptionsContainer>
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
  const [buttonGroup, setButtonGroup] = useState<ButtonGroupType>('none')
  const isHidden = scrollStage >= 3
  const hideText = scrollStage >= 2
  const contextValue = { hideText, setButtonGroup }

  useEffect(() => {
    setButtonGroup('none')
  }, [scrollStage])

  return (
    <MobileToolbarContext.Provider value={contextValue}>
      <MobileToolbarContainer $isHidden={isHidden} $hideText={hideText}>
        <ToolBar>
          <FeedbackButton />
          <ShareButton />
          <SwitchButton />
          <FontSizeButton onClick={onFontSizeChange} />
          <IVODButton link={iVODLink} />
          <ShareButtonGroup isShow={buttonGroup === 'share'} />
          <SwitchButtonGroup
            isShow={buttonGroup === 'switch'}
            onSwitchClick={onSwitchClick}
            isFirstSpeech={isFirstSpeech}
            isLastSpeech={isLastSpeech}
          />
        </ToolBar>
      </MobileToolbarContainer>
    </MobileToolbarContext.Provider>
  )
}

type AboutPageMobileToolbarProps = {
  onFontSizeChange: () => void
  scrollStage: number
}
export const AboutPageMobileToolbar: React.FC<AboutPageMobileToolbarProps> = ({
  onFontSizeChange,
  scrollStage,
}) => {
  const [buttonGroup, setButtonGroup] = useState<ButtonGroupType>('none')
  const isHidden = scrollStage >= 3
  const hideText = scrollStage >= 2
  const contextValue = { hideText, setButtonGroup }

  useEffect(() => {
    setButtonGroup('none')
  }, [scrollStage])

  return (
    <MobileToolbarContext.Provider value={contextValue}>
      <MobileToolbarContainer $isHidden={isHidden} $hideText={hideText}>
        <ToolBar>
          <FeedbackButton />
          <ShareButton />
          <FontSizeButton onClick={onFontSizeChange} />
          <ShareButtonGroup isShow={buttonGroup === 'share'} />
        </ToolBar>
      </MobileToolbarContainer>
    </MobileToolbarContext.Provider>
  )
}

export default MobileToolbar
