import React, { FC } from 'react'
import styled from 'styled-components'
// @twreporter
import EmptyState from '@twreporter/react-components/lib/empty-state'

const Box = styled.div`
  padding: 72px 0 120px 0;
  width: 100%;
  display: flex;
  justify-content: center;
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const EmptyContent: FC = () => (
  <Box>
    <EmptyState
      releaseBranch={releaseBranch}
      title={'查無資料'}
      showGuide={true}
      guide={'請重新設定篩選項目'}
      showButton={false}
      style={EmptyState.Style.DEFAULT}
    />
  </Box>
)

export default EmptyContent
