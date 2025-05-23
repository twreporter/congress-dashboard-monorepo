'use client'
import React, { memo } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import {
  colorSupportive,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { P1, P2, P4 } from '@twreporter/react-components/lib/text/paragraph'
// constants
import { InternalRoutes } from '@/constants/routes'

// date stamp component
const getDateFormat = (date: Date) => {
  let month = ''
  const day = date.getDate()

  switch (date.getMonth()) {
    case 0: {
      month = '一月'
      break
    }
    case 1: {
      month = '二月'
      break
    }
    case 2: {
      month = '三月'
      break
    }
    case 3: {
      month = '四月'
      break
    }
    case 4: {
      month = '五月'
      break
    }
    case 5: {
      month = '六月'
      break
    }
    case 6: {
      month = '七月'
      break
    }
    case 7: {
      month = '八月'
      break
    }
    case 8: {
      month = '九月'
      break
    }
    case 9: {
      month = '十月'
      break
    }
    case 10: {
      month = '十一月'
      break
    }
    case 11: {
      month = '十二月'
      break
    }
  }

  return { month, day }
}

const DateBox = styled.div`
  background-color: ${colorSupportive.main};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
`
const Month = styled(P4)`
  color: ${colorGrayscale.white};
`
const Day = styled(P2)`
  color: ${colorGrayscale.white};
`

type DateStampProps = {
  date: Date
}
const DateStamp: React.FC<DateStampProps> = memo(({ date }) => {
  const { month, day } = getDateFormat(date)
  return (
    <DateBox>
      <Month text={month} weight={P4.Weight.BOLD} />
      <Day text={day} weight={P2.Weight.BOLD} />
    </DateBox>
  )
})
DateStamp.displayName = 'date-stamp'

// summary card component
const CardBox = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: ${colorGrayscale.gray100};
  padding: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(241, 241, 241, 0.5);
  }
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`
const Title = styled(P1)`
  color: ${colorGrayscale.gray800};
  margin-left: 12px;
  align-self: center;
`
const HorizontalLine = styled.div`
  border-bottom: 1px solid ${colorGrayscale.gray300};
  margin: 16px 0;
`
const Content = styled(P1)`
  color: ${colorGrayscale.gray800};
  display: contents !important;
`
const More = styled.span`
  color: ${colorSupportive.heavy};
  display: inline-block;
  text-decoration: underline;
  text-decoration-color: ${colorGrayscale.gray300};
`

export type SummaryCardProps = {
  date: string | Date
  title: string
  summary: string
  slug: string
}
export const SummaryCard: React.FC<SummaryCardProps> = ({
  date,
  title,
  summary,
  slug,
}) => {
  // summary will be like this:
  // "<ul><li>this is a long sentence</li><li>this is a long sentence</li></ul>" or "this is a long sentence"
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const parsedSummary = summary.replace(/<[^>]*>/g, '')
  return (
    <CardBox>
      <FlexRow>
        <DateStamp date={dateObj} />
        <Title text={title} weight={P1.Weight.BOLD} />
      </FlexRow>
      <HorizontalLine />
      <Content>
        {`${parsedSummary}（`}
        <Link href={`${InternalRoutes.Speech}/${slug}`}>
          <More>{'閱讀更多'}</More>
        </Link>
        {'）'}
      </Content>
    </CardBox>
  )
}

// summary cards within a year component
const Box = styled.div``
const Year = styled(P1)`
  color: ${colorGrayscale.gray700};
`
const CardList = styled.div`
  gap: 20px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
`

export type CardsOfTheYearProps = {
  cards: SummaryCardProps[]
  year: number
}
const CardsOfTheYear: React.FC<CardsOfTheYearProps> = ({
  year,
  cards,
}: CardsOfTheYearProps) => (
  <Box>
    <Year text={`${year}`} />
    <CardList>
      {cards.map((props: SummaryCardProps, index: number) => (
        <SummaryCard {...props} key={`summary-card-${year}-${index}`} />
      ))}
    </CardList>
  </Box>
)

export default CardsOfTheYear
