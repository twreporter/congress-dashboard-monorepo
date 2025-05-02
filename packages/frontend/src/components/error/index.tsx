'use client'
import React, { useEffect } from 'react'
import styled from 'styled-components'
// type
import type { ErrorType } from '@/components/error/type'
// @twreporter
import { H3 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
`

const getErrorMsg = (err: ErrorType): string => {
  if (typeof err === 'string') {
    return err
  }
  return JSON.stringify(err)
}

type ErrorProps = {
  title: string
  error: ErrorType
}
const Error: React.FC<ErrorProps> = ({ title, error }) => {
  const errorMsg = getErrorMsg(error)

  useEffect(() => {
    console.log(error)
  }, [])

  return (
    <Box>
      <H3 text={title} />
      <P1 text={errorMsg} />
    </Box>
  )
}

export default Error
