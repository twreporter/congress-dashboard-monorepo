import styled from 'styled-components'
// @twreporter
import { H4, H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// utils
import { notoSerif } from '@/utils/font'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  padding: 24px 24px 12px 24px;
  font-family: ${notoSerif.style.fontFamily} !important;
  ${mq.tabletOnly`
    padding: 32px 32px 12px 32px;
  `}
`

export const Body = styled.div`
  display: flex;
  padding: 24px 24px 40px 24px;
  flex-direction: column;
  gap: 40px;
  ${mq.tabletOnly`
    padding: 24px 32px 40px 32px;
  `}
`

export const SummarySection = styled.div`
  gap: 32px;
  display: flex;
  flex-direction: column;
`

export const FollowMoreSection = styled.div`
  border-top: 1px solid ${colorGrayscale.gray300};
  padding-top: 40px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const FollowMoreTitle = styled(H5)`
  color: ${colorGrayscale.gray800};
`
