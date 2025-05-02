'use client'
import React from 'react'
import styled, { keyframes, css } from 'styled-components'
// @twreporter
import { Loading } from '@twreporter/react-components/lib/icon'

const spin = keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
`
const LoadingBox = styled.div<{ $useAbsolute: boolean }>`
  ${(props) =>
    props.$useAbsolute
      ? css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `
      : css`
          width: 100%;
          height: 100%;
        `}
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 48px;
    height: 48px;
    animation: ${spin} 1s linear infinite;
  }
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRNCH
type LoaderPropsType = {
  useAbsolute?: boolean
}
export const Loader: React.FC<LoaderPropsType> = ({ useAbsolute = true }) => (
  <LoadingBox $useAbsolute={useAbsolute}>
    <Loading releaseBranch={releaseBranch} />
  </LoadingBox>
)
