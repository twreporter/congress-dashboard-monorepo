import styled, { css } from 'styled-components'
import { colorOpacity } from '@twreporter/core/lib/constants/color'

export const textOverflowEllipsisCss = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const AvatarCircleCss = styled.div`
  border: 1px solid ${colorOpacity['black_0.05']};
  object-fit: cover;
`
