'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import Divider from '@twreporter/react-components/lib/divider'
import {
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
import releaseBranchConsts from '@twreporter/core/lib/constants/release-branch'
import origins from '@twreporter/core/lib/constants/request-origins'
import { fundraisingId } from '@twreporter/core/lib/constants/fundraising'
// component
import Logo from '@/components/footer/logo'
import FooterLink, { TextSize } from '@/components/footer/link'
import SocialMediaIcons from '@/components/footer/social-media'
// constants
import { InternalRoutes, ExternalRoutes } from '@/constants/routes'
// utils
import { openFeedback } from '@/utils/feedback'

const StyledFooter = styled.footer`
  width: 100%;
  height: 100%;
  background-color: ${colorGrayscale.white};
  padding: 48px;

  ${mq.hdOnly`
    padding: 48px 0;
  `}

  ${mq.tabletOnly`
    padding: 48px 0;
  `}
  
  ${mq.mobileOnly`
    padding: 48px 24px;
  `}
`

const FooterSection = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;

  ${mq.hdOnly`
    max-width: 1200px;
  `}

  ${mq.tabletAndBelow`
    max-width: 400px;
  `}
`

const UpperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${mq.tabletAndBelow`
    flex-direction: column;
    gap: 48px;
  `}
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mq.desktopAndAbove`
    max-width: 320px;
  `}

  ${mq.tabletAndBelow`
    width: 100%;
    align-items: center;
    text-align: center;
  `}
`

const P2Gray600 = styled(P2)`
  color: ${colorGrayscale.gray600};
`

const LinksContainer = styled.div`
  display: flex;
  gap: 24px;

  ${mq.tabletAndBelow`
    width: 100%;
  `}
`

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 120px;
  gap: 16px;

  ${mq.tabletAndBelow`
    flex-grow: 1;
    flex-basis: 50%;
    max-width: 50%;
    word-wrap: break-word;
  `}
`

const DividerWrapper = styled.div`
  padding: 24px 0;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${mq.tabletAndBelow`
    flex-direction: column;
  `}
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
`

const P3Gray600 = styled(P3)`
  color: ${colorGrayscale.gray600};
`

const DesktopAndAboveWithFlex = styled(DesktopAndAbove)`
  ${mq.desktopAndAbove`
    display: flex !important;
  `}
`
const TabletAndBelowWithFlex = styled(TabletAndBelow)`
  ${mq.tabletAndBelow`
    display: flex !important;
    align-items: center;
    flex-direction: column;
  `}
`
const Feedback = styled(P2Gray600)`
  cursor: pointer;

  &:hover {
    color: ${colorGrayscale.gray800};
  }
`

const BottomLinksContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Gap = styled.div<{ $height?: number; $width?: number }>`
  height: ${(props) => props.$height || 0}px;
  width: ${(props) => props.$width || 0}px;
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Footer: React.FC = () => {
  const BottomLinks = ({ releaseBranch = releaseBranchConsts.release }) => {
    const mainOrigin = origins.forClientSideRendering[releaseBranch].main
    return (
      <BottomLinksContainer>
        <FooterLink
          href={`${mainOrigin}/a/license-footer`}
          text="許可協議"
          target="_blank"
          size={TextSize.S}
        />
        <P3Gray600 text="｜" />
        <FooterLink
          href={`${mainOrigin}/a/privacy-footer`}
          text="隱私政策"
          target="_blank"
          size={TextSize.S}
        />
      </BottomLinksContainer>
    )
  }

  return (
    <StyledFooter className="hidden-print">
      <FooterSection>
        <UpperContainer>
          <InfoContainer>
            <Logo releaseBranch={releaseBranch} />
            <P2Gray600 text="台灣第一個由公益基金會成立的網路媒體，致力於公共領域調查報導，打造多元進步的媒體環境。" />
          </InfoContainer>
          <LinksContainer>
            <LinkGroup>
              <FooterLink
                href={InternalRoutes.About}
                text="關於觀測站"
                target="_self"
              />
              <FooterLink
                href={`${InternalRoutes.About}#「報導者觀測站」涵蓋多少資料？更新頻率為何？會再加入其他資料？`}
                text="資料更新說明"
                target="_blank"
              />
              <Feedback
                text="意見回饋"
                onClick={() => openFeedback('footer')}
              />
            </LinkGroup>
            <LinkGroup>
              <FooterLink
                href={ExternalRoutes.AboutTwreporter}
                text="關於我們"
                target="_blank"
              />
              <FooterLink
                href={ExternalRoutes.TwReporter}
                text="前往《報導者》"
                target="_blank"
              />
              <FooterLink
                href={ExternalRoutes.Medium}
                text="開放實驗室"
                target="_blank"
              />
            </LinkGroup>
            <LinkGroup>
              <FooterLink
                href={ExternalRoutes.Support}
                text="贊助支持"
                target="_blank"
              />
              <FooterLink
                href={ExternalRoutes.Subscription}
                text="訂閱電子報"
                target="_blank"
              />
              <FooterLink
                href={ExternalRoutes.SubscribePodcast}
                text="訂閱 Podcast"
                target="_blank"
              />
            </LinkGroup>
          </LinksContainer>
        </UpperContainer>
        <DividerWrapper>
          <Divider />
        </DividerWrapper>
        <BottomContainer>
          <BottomSection>
            <DesktopAndAboveWithFlex>
              <P3Gray600 text={fundraisingId} />
              <P3Gray600 text="｜" />
              <BottomLinks releaseBranch={releaseBranch} />
              <P3Gray600 text="｜" />
              <P3Gray600
                text={`Copyright © ${new Date().getFullYear()} The Reporter.`}
              />
            </DesktopAndAboveWithFlex>
            <TabletAndBelowWithFlex>
              <SocialMediaIcons />
              <Gap $height={24} />
              <P3Gray600 text={fundraisingId} />
              <BottomLinks releaseBranch={releaseBranch} />
              <P3Gray600
                text={`Copyright © ${new Date().getFullYear()} The Reporter.`}
              />
            </TabletAndBelowWithFlex>
          </BottomSection>
          <BottomSection>
            <DesktopAndAboveWithFlex>
              <SocialMediaIcons />
            </DesktopAndAboveWithFlex>
          </BottomSection>
        </BottomContainer>
      </FooterSection>
    </StyledFooter>
  )
}

export default Footer
