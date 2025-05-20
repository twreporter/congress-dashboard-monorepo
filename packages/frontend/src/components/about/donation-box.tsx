'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { DONATION_LINK_ANCHOR } from '@twreporter/core/lib/constants/donation-link-anchor'
// constants
import { ExternalRoutes } from '@/constants/routes'

const Container = styled.div`
  display: flex;
  margin: 56px auto;
  width: 100%;
  max-width: 500px;
  padding: 40px 32px;
  flex-direction: column;
  gap: 40px;
  background: ${colorGrayscale.white};
  border-left: solid 1px ${colorSupportive.pastel};
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled(H4)`
  width: fit-content;
  color: ${colorGrayscale.gray800};
  background: ${colorSupportive.pastel};
  padding-right: 2px;
  box-shadow: 5px 15px 0 ${colorGrayscale.white} inset;
`

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Text = styled.div`
  color: ${colorGrayscale.gray800};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.064px;
`

const DonationButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
`

const DonationButton = styled.button`
  display: flex;
  width: 140px;
  height: 55px;
  padding: 16px 10px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0.168px;
  color: ${colorGrayscale.white};
  background: ${colorGrayscale.black};
  cursor: pointer;
  border: none;
  &:hover {
    background: ${colorSupportive.heavy};
  }
`

const DonationBox: React.FC = () => {
  const onDonationButtonClick = () => {
    window.open(
      `${ExternalRoutes.Support}#${DONATION_LINK_ANCHOR.impact}`,
      '_blank'
    )
  }
  return (
    <Container>
      <Content>
        <Title text={'用行動支持報導者'} />
        <Description>
          <Text>
            獨立的精神，是自由思想的條件。獨立的媒體，才能守護公共領域，讓自由的討論和真相浮現。
          </Text>
          <Text>
            在艱困的媒體環境，《報導者》堅持以非營利組織的模式投入公共領域的調查與深度報導。我們透過讀者的贊助支持來營運，不仰賴商業廣告置入，在獨立自主的前提下，穿梭在各項重要公共議題中。
          </Text>
          <Text>
            你的支持能幫助《報導者》持續追蹤國內外新聞事件的真相，邀請你加入 3
            種支持方案，和我們一起推動這場媒體小革命。
          </Text>
        </Description>
      </Content>
      <DonationButtonContainer>
        <DonationButton onClick={onDonationButtonClick}>
          立即支持
        </DonationButton>
      </DonationButtonContainer>
    </Container>
  )
}

export default DonationBox
