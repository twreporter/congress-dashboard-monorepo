'use client'
import React, { useEffect } from 'react'
import styled from 'styled-components'
// @twreporter
import { H3 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
`

type ErrorType = Error | { digest?: string }

type ErrorProps = {
  error: ErrorType
  reset: () => void
}
const ErrorBoundary: React.FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  const errorMsg =
    error instanceof Error ? error.message : error.digest || 'Unknown reason'

  return (
    <Box>
      <H3 text={'Failed to fetch home page data'} />
      <P1 text={errorMsg} />
      <button onClick={() => reset()}>Try again</button>
    </Box>
  )
}

export default ErrorBoundary
