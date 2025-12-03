'use client'
import React, { useState, createContext, useContext, useEffect } from 'react'
// @twreporter
import { IconWithTextButton } from '@twreporter/react-components/lib/button'
import { Video } from '@twreporter/react-components/lib/icon'
// components
import {
  FeedbackButton,
  ShareButton,
  ShareButtonGroup,
  FontSizeButton,
} from '@/components/speech/speech-mobile-toolbar'
// styles
import {
  MobileToolbarContainer,
  ToolBar,
  ButtonContainer,
} from '@/components/speech/speech-mobile-toolbar'
// type
import type { ToolbarContext } from '@/components/speech/speech-mobile-toolbar'
type ButtonGroupType = 'share' | 'switch' | 'none'

// global variables
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const MobileToolbarContext = createContext<ToolbarContext>({
  hideText: false,
  setButtonGroup: () => {},
})

// Source Button Conponent
type SoureButtonProps = {
  link?: string
}

const SourceButton: React.FC<SoureButtonProps> = ({ link }) => {
  const { hideText } = useContext(MobileToolbarContext)
  const openSource = () => {
    if (!link) {
      alert('此議案沒有資料來源')
      return
    }
    window.open(link, '_blank')
  }
  return (
    <ButtonContainer onClick={openSource}>
      <IconWithTextButton
        text="資料來源"
        iconComponent={<Video releaseBranch={releaseBranch} />}
        hideText={hideText}
      />
    </ButtonContainer>
  )
}

// Mobile Toolbar Component
type MobileToolbarProps = {
  onFontSizeChange: () => void
  sourceLink?: string
  scrollStage: number
}
const MobileToolbar: React.FC<MobileToolbarProps> = ({
  onFontSizeChange,
  sourceLink,
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
          <FeedbackButton
            eventName="council bill mobile toolbar"
            context={MobileToolbarContext}
          />
          <ShareButton context={MobileToolbarContext} />
          <FontSizeButton
            onClick={onFontSizeChange}
            context={MobileToolbarContext}
          />
          <SourceButton link={sourceLink} />
          <ShareButtonGroup isShow={buttonGroup === 'share'} />
        </ToolBar>
      </MobileToolbarContainer>
    </MobileToolbarContext.Provider>
  )
}

export default MobileToolbar
