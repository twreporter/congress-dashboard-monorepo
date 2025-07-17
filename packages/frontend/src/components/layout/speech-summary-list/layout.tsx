import styled from 'styled-components'
// @twreporter
import { H4, H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// utils
import { notoSerif } from '@/utils/font'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Title = styled(H4)<{ $isEmpty: boolean }>`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
  padding: ${(props) =>
    props.$isEmpty ? '24px 24px 20px 24px' : '24px 24px 12px 24px'};
  border-bottom: ${(props) =>
    props.$isEmpty ? `1px solid ${colorGrayscale.gray300}` : 'none'};

  ${mq.tabletOnly`
    padding: ${(props) =>
      props.$isEmpty ? '24px 32px 20px 32px' : '24px 32px 12px 32px'};
  `}
`

export const Body = styled.div`
  height: 100%;
  position: relative;
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

export const EmptyState = styled.div`
  display: flex;
  padding-top: 200px;
  padding-bottom: 200px;
  justify-content: center;
  align-items: center;
  ${mq.tabletAndBelow`
    padding-top: 160px;
    padding-bottom: 160px;
  `}
`

export const EmptyStateColumn = styled(EmptyState)`
  align-self: center;
  flex-direction: column;
  gap: 8px;
  width: 320px;
`

export const EmptyStateTitle = styled(H5)`
  color: ${colorGrayscale.gray800};
`

export const EmptyStateText = styled(P1)`
  color: ${colorGrayscale.gray700};
  text-align: center;
`
