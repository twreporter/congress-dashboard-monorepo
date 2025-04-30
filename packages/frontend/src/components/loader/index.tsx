'use client'
import React from 'react'
import styled, { keyframes } from 'styled-components'
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
const LoadingBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;

  svg {
    width: 48px;
    height: 48px;
    animation: ${spin} 1s linear infinite;
  }
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRNCH
export const Loader: React.FC = () => (
  <LoadingBox>
    <Loading releaseBranch={releaseBranch} />
  </LoadingBox>
)
