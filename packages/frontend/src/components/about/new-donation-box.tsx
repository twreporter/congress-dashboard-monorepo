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
import externalLinks from '@twreporter/core/lib/constants/external-links'
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
  letter-spacing: 0.4px;
  a {
    color: ${colorSupportive.heavy};
    text-decoration: none;
    border-bottom: 1px solid ${colorGrayscale.gray300};
  }
  a:hover {
    border-color: ${colorSupportive.heavy};
  }
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
        <Title text={'深度求真 眾聲同行'} />
        <Description>
          <Text>
            獨立的精神，是自由思想的條件。獨立的媒體，才能守護公共領域，讓自由的討論和真相浮現。
          </Text>
          <Text>
            在艱困的媒體環境，《報導者》堅持以非營利組織的模式投入公共領域的調查與深度報導。我們透過讀者的贊助支持來營運，不仰賴商業廣告置入，在獨立自主的前提下，穿梭在各項重要公共議題中。
          </Text>
          <Text>
            今年是
            <a
              href={externalLinks.tenYearAnniversary}
              target="_blank"
              rel="noopener noreferrer"
            >
              《報導者》成立十週年
            </a>
            ，請支持我們持續追蹤國內外新聞事件的真相，度過下一個十年的挑戰。
          </Text>
        </Description>
      </Content>
      <DonationButtonContainer>
        <DonationButton onClick={onDonationButtonClick}>
          贊助支持
        </DonationButton>
      </DonationButtonContainer>
    </Container>
  )
}

export default DonationBox
