import React, { FC, memo } from 'react'
import styled from 'styled-components'
// twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const Title = styled(H5)`
  color: ${colorGrayscale.gray800};
  display: flex;
  justify-content: center;
`
const Note = styled(P1)`
  color: ${colorGrayscale.gray700};
  text-align: center;
  justify-content: center;
  width: 320px;
`

type NoIssueStateProps = {
  note?: string
}
const NoIssueState: FC<NoIssueStateProps> = memo(({ note }) => (
  <Container>
    <Title text={'所選會期無發言資訊'} />
    {note ? <Note text={note} /> : null}
  </Container>
))
NoIssueState.displayName = 'sidebar-no-issue-state'

export default NoIssueState
