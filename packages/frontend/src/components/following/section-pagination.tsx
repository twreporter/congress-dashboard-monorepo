'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import Pagination from '@twreporter/react-components/lib/pagination'

const StyledPagination = styled(Pagination)`
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`

type SectionPaginationProps = {
  currentPage: number
  totalPages: number
  handleClickPrev: () => void
  handleClickNext: () => void
}
export const SectionPagination: FC<SectionPaginationProps> = ({
  currentPage,
  totalPages,
  handleClickPrev,
  handleClickNext,
}) => {
  return (
    <StyledPagination
      currentPage={currentPage}
      totalPages={totalPages}
      handleClickPrev={handleClickPrev}
      handleClickNext={handleClickNext}
    />
  )
}
